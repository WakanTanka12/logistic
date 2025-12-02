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
    getAllDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
} from "../api/deliveriesApi";
import { getDriverById } from "../api/driversApi";
import { getOrderById } from "../api/ordersApi";

export default function DeliveriesScreen() {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]); // DriverResponse[]
    const [orders, setOrders] = useState([]);   // OrderResponse[]
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        id: null,
        status: "",
        deliveryDate: "",
        driverId: "",
        orderId: "",
    });

    // 🔹 Cargar todas las entregas
    const loadDeliveries = async () => {
        try {
            setLoading(true);
            const res = await getAllDeliveries();
            setDeliveries(res.data);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudieron cargar las entregas");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Cargar un driver por ID y almacenarlo si no existe aún
    const loadDriver = async (driverId) => {
        try {
            // evitar duplicados
            if (drivers.some((d) => d.id === driverId)) return;

            const res = await getDriverById(driverId);
            setDrivers((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Error fetching driver:", err);
        }
    };

    // 🔹 Cargar una orden por ID y almacenarla si no existe aún
    const loadOrder = async (orderId) => {
        try {
            if (orders.some((o) => o.id === orderId)) return;

            const res = await getOrderById(orderId);
            setOrders((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Error fetching order:", err);
        }
    };

    useEffect(() => {
        loadDeliveries();
    }, []);

    // Cuando cambian las entregas, cargamos drivers y órdenes relacionadas
    useEffect(() => {
        if (!deliveries.length) {
            setDrivers([]);
            setOrders([]);
            return;
        }

        deliveries.forEach((delivery) => {
            if (delivery.driverId) {
                loadDriver(delivery.driverId);
            }
            if (delivery.orderId) {
                loadOrder(delivery.orderId);
            }
        });
    }, [deliveries]);

    const handleEdit = (delivery) => {
        setForm({
            id: delivery.id,
            status: delivery.status || "",
            deliveryDate: delivery.deliveryDate || "",
            driverId: delivery.driverId ? String(delivery.driverId) : "",
            orderId: delivery.orderId ? String(delivery.orderId) : "",
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
        if (!form.orderId || !form.driverId) {
            Alert.alert("Error", "OrderId y DriverId son obligatorios");
            return;
        }

        const payload = {
            status: form.status || "PENDING",
            deliveryDate: form.deliveryDate || null, // formato según tu backend (LocalDate / LocalDateTime)
            driverId: Number(form.driverId),
            orderId: Number(form.orderId),
        };

        try {
            setSaving(true);

            if (form.id) {
                await updateDelivery(form.id, payload);
            } else {
                // createDelivery debería internamente hacer POST a /drivers/{driverId}/deliveries
                await createDelivery(payload);
            }

            setForm({
                id: null,
                status: "",
                deliveryDate: "",
                driverId: "",
                orderId: "",
            });

            await loadDeliveries();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar la entrega");
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => {
        const driver = drivers.find((d) => d.id === item.driverId);
        const order = orders.find((o) => o.id === item.orderId);

        return (
            <View style={styles.card}>
                <Text style={styles.title}>Entrega #{item.id}</Text>
                <Text style={styles.text}>Estado: {item.status}</Text>

                {item.deliveryDate && (
                    <Text style={styles.text}>Fecha: {item.deliveryDate}</Text>
                )}

                <Text style={styles.text}>
                    Driver:{" "}
                    {driver
                        ? `${driver.firstName} ${driver.lastName}`
                        : item.driverId || "N/D"}
                </Text>

                <Text style={styles.text}>
                    Orden:{" "}
                    {order
                        ? `#${order.id} - ${order.details ?? ""}`
                        : item.orderId || "N/D"}
                </Text>

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
                    contentContainerStyle={{ paddingBottom: 180 }}
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
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, status: text }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Fecha entrega (ej: 2025-11-23)"
                    value={form.deliveryDate}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, deliveryDate: text }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Driver ID"
                    value={form.driverId}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, driverId: text }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Order ID"
                    value={form.orderId}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, orderId: text }))
                    }
                />

                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    <Text style={styles.buttonText}>
                        {saving
                            ? "Guardando..."
                            : form.id
                                ? "Actualizar"
                                : "Crear"}
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
});
