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
    getAllCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
} from "../api/customersApi";
import { getOrdersByCustomer } from "../api/ordersApi";

// 🔹 Nombre legible usando firstName / lastName
const getCustomerDisplayName = (customer) => {
    const fullName = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
    if (fullName) return fullName;

    // Por si en algún momento existiera "name"
    if (customer.name && customer.name.trim() !== "") {
        return customer.name;
    }

    return `Cliente #${customer.id}`;
};

export default function CustomersScreen() {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]); // lista de órdenes de todos los clientes
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // ✅ AHORA usamos firstName, lastName, email, phone, address
    const [form, setForm] = useState({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    // 🔹 Cargar todos los customers
    const loadCustomers = async () => {
        try {
            setLoading(true);
            const res = await getAllCustomers();
            setCustomers(res.data); // List<CustomerResponse>
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudieron cargar los clientes");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Cargar órdenes de un customer (GET /customers/{id}/orders)
    const loadOrdersForCustomer = async (customerId) => {
        try {
            const res = await getOrdersByCustomer(customerId);
            setOrders((prev) => [...prev, ...res.data]); // acumulamos todas las órdenes
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    // Cuando cambia la lista de customers, recargamos órdenes
    useEffect(() => {
        if (!customers.length) {
            setOrders([]);
            return;
        }
        // limpiamos órdenes antes de recargar para evitar duplicados
        setOrders([]);
        customers.forEach((customer) => {
            if (customer.id) {
                loadOrdersForCustomer(customer.id);
            }
        });
    }, [customers]);

    // 🔹 Editar: rellenar el formulario con firstName/lastName...
    const handleEdit = (customer) => {
        setForm({
            id: customer.id,
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
        });
    };

    const handleDelete = (id) => {
        Alert.alert("Confirmar", "¿Eliminar este cliente?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteCustomer(id);
                        await loadCustomers();
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "No se pudo eliminar el cliente");
                    }
                },
            },
        ]);
    };

    const handleSubmit = async () => {
        if (!form.firstName || !form.lastName || !form.email) {
            Alert.alert("Error", "Nombre, apellido y email son obligatorios");
            return;
        }

        // ✅ Payload alineado con tu CustomerRequest del backend
        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
        };

        try {
            setSaving(true);

            if (form.id) {
                await updateCustomer(form.id, payload);
            } else {
                await addCustomer(payload);
            }

            // Limpiar form
            setForm({
                id: null,
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
            });

            await loadCustomers();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar el cliente");
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{getCustomerDisplayName(item)}</Text>

            {item.email && <Text style={styles.text}>Email: {item.email}</Text>}
            {item.phone && <Text style={styles.text}>Teléfono: {item.phone}</Text>}
            {item.address && (
                <Text style={styles.text}>Dirección: {item.address}</Text>
            )}

            {/* 🔹 Órdenes asociadas */}
            <View style={styles.ordersContainer}>
                <Text style={styles.ordersTitle}>Órdenes asociadas:</Text>
                {orders
                    .filter((order) => order.customerId === item.id)
                    .map((order) => (
                        <Text key={order.id} style={styles.text}>
                            Orden #{order.id} - {order.details}
                        </Text>
                    ))}
                {orders.filter((o) => o.customerId === item.id).length === 0 && (
                    <Text style={styles.text}>Sin órdenes registradas.</Text>
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Clientes</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={customers}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    style={{ flex:1 }}
                    contentContainerStyle={{ paddingBottom: 350 }}
                />
            )}

            {/* 🔹 Formulario crear/editar */}
            <View className="formContainer" style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {form.id ? "Editar cliente" : "Nuevo cliente"}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={form.firstName}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, firstName: text }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={form.lastName}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, lastName: text }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={form.email}
                    autoCapitalize="none"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, email: text }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    value={form.phone}
                    keyboardType="phone-pad"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, phone: text }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Dirección"
                    value={form.address}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, address: text }))
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
    ordersContainer: {
        marginTop: 10,
    },
    ordersTitle: {
        fontWeight: "bold",
        marginBottom: 4,
    },
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
