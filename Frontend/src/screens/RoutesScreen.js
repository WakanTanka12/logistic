// src/screens/RoutesScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";

import {
    getAllRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
} from "../api/routesApi";

import { getAllDeliveries } from "../api/deliveriesApi";
import { getDriverById } from "../api/driversApi";

export default function RoutesScreen() {
    const [routes, setRoutes] = useState([]);
    const [deliveries, setDeliveries] = useState([]); // TODAS las entregas
    const [drivers, setDrivers] = useState({});       // { [driverId]: DriverResponse }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        id: null,
        name: "",
        origin: "",
        destination: "",
    });

    // ================= CARGAS =================
    const loadRoutes = async () => {
        try {
            setLoading(true);
            const res = await getAllRoutes();
            setRoutes(res.data ?? res);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudieron cargar las rutas");
        } finally {
            setLoading(false);
        }
    };

    const loadAllDeliveries = async () => {
        try {
            const res = await getAllDeliveries();
            const list = res.data ?? res;
            setDeliveries(list);

            // cargar drivers para esas deliveries
            list.forEach((d) => {
                if (d.driverId) loadDriver(d.driverId);
            });
        } catch (err) {
            console.error("Error cargando entregas:", err);
        }
    };

    const loadDriver = async (driverId) => {
        if (drivers[driverId]) return; // ya lo tenemos

        try {
            const res = await getDriverById(driverId);
            setDrivers((prev) => ({
                ...prev,
                [driverId]: res.data ?? res,
            }));
        } catch (err) {
            console.error("Error cargando driver:", err);
        }
    };

    useEffect(() => {
        loadRoutes();
        loadAllDeliveries();
    }, []);

    // ================= FORM =================
    const handleEdit = (route) => {
        setForm({
            id: route.id,
            // por si el backend usa "routeName" en lugar de "name"
            name: route.name || route.routeName || "",
            origin: route.origin || "",
            destination: route.destination || "",
        });
    };

    const handleDelete = (id) => {
        Alert.alert("Confirmar", "¿Eliminar esta ruta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteRoute(id);
                        await loadRoutes();
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "No se pudo eliminar la ruta");
                    }
                },
            },
        ]);
    };

    const handleSubmit = async () => {
        if (!form.name) {
            Alert.alert("Error", "El nombre es obligatorio");
            return;
        }

        const payload = {
            name: form.name,
            origin: form.origin,
            destination: form.destination,
        };

        try {
            setSaving(true);
            if (form.id) {
                await updateRoute(form.id, payload);
            } else {
                await createRoute(payload);
            }

            setForm({ id: null, name: "", origin: "", destination: "" });
            await loadRoutes();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar la ruta");
        } finally {
            setSaving(false);
        }
    };

    // ================= ITEM =================
    const renderItem = ({ item }) => {
        // nombre robusto
        const routeName = item.name || item.routeName || `Ruta #${item.id}`;

        // todas las deliveries de ESTA ruta
        const routeDeliveries = deliveries.filter(
            (d) => d.routeId === item.id
        );

        return (
            <View style={styles.card}>
                <Text style={styles.title}>{routeName}</Text>
                <Text style={styles.text}>Origen: {item.origin}</Text>
                <Text style={styles.text}>Destino: {item.destination}</Text>

                <View style={styles.deliveriesContainer}>
                    <Text style={styles.deliveriesTitle}>Entregas asociadas:</Text>

                    {routeDeliveries.length === 0 ? (
                        <Text style={styles.text}>No hay entregas en esta ruta.</Text>
                    ) : (
                        <>
                            {/* Línea con todos los IDs */}
                            <Text
                                style={[
                                    styles.text,
                                    { fontWeight: "bold", marginBottom: 4 },
                                ]}
                            >
                                IDs de entregas:{" "}
                                {routeDeliveries.map((d) => `#${d.id}`).join(", ")}
                            </Text>

                            {/* Detalle por entrega */}
                            {routeDeliveries.map((delivery) => {
                                const driver = drivers[delivery.driverId];
                                return (
                                    <Text key={delivery.id} style={styles.text}>
                                        Entrega #{delivery.id} - {delivery.status} | Conductor:{" "}
                                        {driver
                                            ? `${driver.firstName} ${driver.lastName}`
                                            : delivery.driverId
                                                ? "Cargando..."
                                                : "Sin conductor"}
                                    </Text>
                                );
                            })}
                        </>
                    )}
                </View>

                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={() => handleEdit(item)}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // ================= RENDER =================
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Rutas</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={routes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    style={{ flex:1 }}
                    contentContainerStyle={{ paddingBottom: 300 }}
                />
            )}

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {form.id ? "Editar ruta" : "Nueva ruta"}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={form.name}
                    onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Origen"
                    value={form.origin}
                    onChangeText={(text) => setForm((f) => ({ ...f, origin: text }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Destino"
                    value={form.destination}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, destination: text }))
                    }
                />

                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    <Text style={styles.buttonText}>
                        {saving ? "Guardando..." : form.id ? "Actualizar" : "Crear"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: "#f5f5f5" },
    header: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        elevation: 2,
    },
    title: { fontSize: 16, fontWeight: "bold" },
    text: { fontSize: 14, color: "#555" },
    row: { flexDirection: "row", marginTop: 8, justifyContent: "flex-end" },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 8,
    },
    editButton: { backgroundColor: "#2A4B9A" },
    deleteButton: { backgroundColor: "#d9534f" },
    buttonText: { color: "#fff", fontWeight: "bold" },
    formContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        padding: 12,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 10,
    },
    formTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    input: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 8,
    },
    saveButton: { backgroundColor: "#28a745", marginTop: 4 },
    deliveriesContainer: { marginTop: 10 },
    deliveriesTitle: { fontWeight: "bold", marginBottom: 6 },
});
