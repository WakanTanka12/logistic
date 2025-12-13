// src/screens/DeliveriesScreen.js
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
import { Picker } from "@react-native-picker/picker";

import {
    getAllDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
} from "../api/deliveriesApi";

import { getAllDrivers } from "../api/driversApi";
import { getAllOrders } from "../api/ordersApi";
import { getAllRoutes } from "../api/routesApi";

export default function DeliveriesScreen() {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        id: null,
        status: "",
        deliveryDate: "",
        driverId: null,
        orderId: null,
        routeId: null,
    });

    // 🔹 Normaliza fechas "2025/12/11" -> "2025-12-11"
    const normalizeDate = (str) => {
        if (!str) return "";
        return str.replace(/\//g, "-");
    };

    // ======== LOADERS ========
    const loadDeliveries = async () => {
        try {
            setLoading(true);
            const res = await getAllDeliveries();
            setDeliveries(res.data ?? res);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudieron cargar las entregas");
        } finally {
            setLoading(false);
        }
    };

    const loadDrivers = async () => {
        try {
            const res = await getAllDrivers();
            setDrivers(res.data ?? res);
        } catch (err) {
            console.error("Error cargando drivers:", err);
        }
    };

    const loadOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data ?? res);
        } catch (err) {
            console.error("Error cargando órdenes:", err);
        }
    };

    const loadRoutes = async () => {
        try {
            const res = await getAllRoutes();
            setRoutes(res.data ?? res);
        } catch (err) {
            console.error("Error cargando rutas:", err);
        }
    };

    useEffect(() => {
        loadDeliveries();
        loadDrivers();
        loadOrders();
        loadRoutes();
    }, []);

    // ======== FORM ========
    const handleEdit = (delivery) => {
        setForm({
            id: delivery.id,
            status: delivery.status || "",
            deliveryDate: delivery.deliveryDate || "",
            driverId: delivery.driverId ?? null,
            orderId: delivery.orderId ?? null,
            routeId: delivery.routeId ?? null,
        });
    };

    const handleDelete = (id) => {
        Alert.alert("Confirmar", "¿Eliminar esta entrega?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDelivery(id);
                        await loadDeliveries();
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "No se pudo eliminar la entrega");
                    }
                },
            },
        ]);
    };

    const handleSubmit = async () => {
        if (!form.driverId || !form.orderId || !form.routeId) {
            Alert.alert(
                "Error",
                "Debes seleccionar un Conductor, una Orden y una Ruta"
            );
            return;
        }



        const payload = {
            status: form.status || "PENDING",
            deliveryDate: form.deliveryDate
                ? normalizeDate(form.deliveryDate)
                : null,
            driverId: Number(form.driverId),
            orderId: Number(form.orderId),
            routeId: Number(form.routeId),
        };

        try {
            setSaving(true);
            if (form.id) {
                await updateDelivery(form.id, payload);
            } else {
                await createDelivery(payload);
            }

            setForm({
                id: null,
                status: "",
                deliveryDate: "",
                driverId: null,
                orderId: null,
                routeId: null,
            });

            await loadDeliveries();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar la entrega");
        } finally {
            setSaving(false);
        }
    };

    // ======== HELPERS PARA NOMBRES ========
    const getRouteLabel = (delivery) => {
        const route = routes.find((r) => r.id === delivery.routeId);
        if (route) {
            return (
                route.name ||
                route.routeName || // por si tu backend usa este
                `Ruta #${route.id}`
            );
        }
        if (delivery.routeId != null) return `Ruta #${delivery.routeId}`;
        return "Sin ruta";
    };

    const getDriverLabel = (delivery) => {
        const driver = drivers.find((d) => d.id === delivery.driverId);
        if (driver) return `${driver.firstName} ${driver.lastName}`;
        if (delivery.driverId != null) return `Driver #${delivery.driverId}`;
        return "Sin conductor";
    };

    const getOrderLabel = (delivery) => {
        const order = orders.find((o) => o.id === delivery.orderId);
        if (order) return `#${order.id} - ${order.details ?? ""}`;
        if (delivery.orderId != null) return `Orden #${delivery.orderId}`;
        return "Sin orden";
    };

    // ======== ITEM LISTA ========
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Entrega #{item.id}</Text>
            <Text style={styles.text}>Estado: {item.status}</Text>

            {item.deliveryDate && (
                <Text style={styles.text}>Fecha: {item.deliveryDate}</Text>
            )}

            <Text style={styles.text}>Driver: {getDriverLabel(item)}</Text>
            <Text style={styles.text}>Orden: {getOrderLabel(item)}</Text>
            <Text style={styles.text}>Ruta: {getRouteLabel(item)}</Text>

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

    // ======== RENDER ========
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Entregas</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={deliveries}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    style={{ flex:1 }}
                    contentContainerStyle={{ paddingBottom: 500 }}
                />
            )}

            {/* Formulario */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {form.id ? "Editar entrega" : "Nueva entrega"}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Estado (PENDING / IN_ROUTE / DELIVERED)"
                    value={form.status}
                    onChangeText={(text) => setForm((f) => ({ ...f, status: text }))}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Fecha entrega (ej: 2025-11-23)"
                    value={form.deliveryDate}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, deliveryDate: text }))
                    }
                />

                {/* Picker Driver */}
                <Text style={styles.label}>Conductor</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.driverId}
                        onValueChange={(value) =>
                            setForm((f) => ({ ...f, driverId: value }))
                        }
                    >
                        <Picker.Item label="Selecciona un conductor..." value={null} />
                        {drivers.map((d) => (
                            <Picker.Item
                                key={d.id}
                                label={`${d.firstName} ${d.lastName}`}
                                value={d.id}
                            />
                        ))}
                    </Picker>
                </View>

                {/* Picker Orden */}
                <Text style={styles.label}>Orden</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.orderId}
                        onValueChange={(value) =>
                            setForm((f) => ({ ...f, orderId: value }))
                        }
                    >
                        <Picker.Item label="Selecciona una orden..." value={null} />
                        {orders.map((o) => (
                            <Picker.Item
                                key={o.id}
                                label={`Orden #${o.id}`}
                                value={o.id}
                            />
                        ))}
                    </Picker>
                </View>

                {/* Picker Ruta */}
                <Text style={styles.label}>Ruta</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.routeId}
                        onValueChange={(value) =>
                            setForm((f) => ({ ...f, routeId: value }))
                        }
                    >
                        <Picker.Item label="Selecciona una ruta..." value={null} />
                        {routes.map((r) => (
                            <Picker.Item
                                key={r.id}
                                label={
                                    r.name ||
                                    r.routeName || // por si el backend usa esto
                                    `Ruta #${r.id}`
                                }
                                value={r.id}
                            />
                        ))}
                    </Picker>
                </View>

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
    label: { marginTop: 8, marginBottom: 4, fontWeight: "600" },
    pickerWrapper: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 8,
    },
});
