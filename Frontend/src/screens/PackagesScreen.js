// src/screens/PackagesScreen.js
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
    getAllPackages,
    updatePackage,
    deletePackage,
    createPackageForOrder,
} from "../api/packagesApi";
import { getAllOrders } from "../api/ordersApi"; // 👈 para listar órdenes

export default function PackagesScreen() {
    const [packages, setPackages] = useState([]);
    const [orders, setOrders] = useState([]); // 👈 lista de órdenes para el Picker
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        id: null,
        length: "",
        width: "",
        height: "",
        weight: "",
        orderId: "", // se maneja como string para el Picker
    });

    const loadPackages = async () => {
        try {
            setLoading(true);
            const res = await getAllPackages();
            setPackages(res.data);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudieron cargar los paquetes");
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data);
        } catch (err) {
            console.error("Error cargando órdenes:", err);
        }
    };

    useEffect(() => {
        loadPackages();
        loadOrders();
    }, []);

    const handleEdit = (pkg) => {
        setForm({
            id: pkg.id,
            length: String(pkg.length ?? ""),
            width: String(pkg.width ?? ""),
            height: String(pkg.height ?? ""),
            weight: String(pkg.weight ?? ""),
            orderId: pkg.orderId ? String(pkg.orderId) : "",
        });
    };

    const handleDelete = (id) => {
        Alert.alert("Confirmar", "¿Eliminar este paquete?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deletePackage(id);
                        await loadPackages();
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "No se pudo eliminar el paquete");
                    }
                },
            },
        ]);
    };

    const handleSubmit = async () => {
        const numberOnlyRegex = /^\d+(\.\d+)?$/;

        if (!form.length || !form.width || !form.height || !form.weight) {
            Alert.alert(
                "Error",
                "Todos los campos de dimensiones y peso son obligatorios"
            );
            return;
        }

        // Para CREAR exigimos que haya una orden seleccionada
        if (!form.id && !form.orderId) {
            Alert.alert("Error", "Debes seleccionar una orden");
            return;
        }

        if (!numberOnlyRegex.test(form.length) || !numberOnlyRegex.test(form.width) || !numberOnlyRegex.test(form.height) || !numberOnlyRegex.test(form.weight)) {
            Alert.alert("Error", "Las dimensiones y el peso deben ser números (enteros o decimales) y solo con .");
            return;
        }

        const payload = {
            length: parseFloat(form.length),
            width: parseFloat(form.width),
            height: parseFloat(form.height),
            weight: parseFloat(form.weight),
        };

        try {
            setSaving(true);
            if (form.id) {
                // actualizar paquete existente
                await updatePackage(form.id, payload);
            } else {
                // crear paquete para una orden específica
                const orderIdNumber = Number(form.orderId);
                if (Number.isNaN(orderIdNumber)) {
                    Alert.alert("Error", "Order ID debe ser un número válido");
                    setSaving(false);
                    return;
                }
                await createPackageForOrder(orderIdNumber, payload);
            }

            setForm({
                id: null,
                length: "",
                width: "",
                height: "",
                weight: "",
                orderId: "",
            });

            await loadPackages();
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo guardar el paquete");
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Paquete #{item.id}</Text>

            <Text style={styles.text}>
                Dimensiones: {item.length} x {item.width} x {item.height}
            </Text>

            {item.weight != null && (
                <Text style={styles.text}>Peso: {item.weight} kg</Text>
            )}

            {/* 🔹 Muestra la relación con la orden */}
            {item.orderId && (
                <Text style={styles.text}>Orden asociada: #{item.orderId}</Text>
            )}

            <View className="row" style={styles.row}>
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
            <Text style={styles.header}>Paquetes</Text>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={packages}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    style={{ flex: 1}}
                    contentContainerStyle={{ paddingBottom: 350 }}
                />
            )}

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {form.id ? "Editar paquete" : "Nuevo paquete"}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Longitud"
                    value={form.length}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, length: text }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ancho"
                    value={form.width}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, width: text }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Altura"
                    value={form.height}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, height: text }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Peso"
                    value={form.weight}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, weight: text }))
                    }
                />

                {/* 🔽 Picker para seleccionar UNA sola orden */}
                {!form.id && (
                    <>
                        <Text style={{ marginBottom: 4, fontWeight: "600" }}>
                            Orden asociada
                        </Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={form.orderId || ""}
                                onValueChange={(value) =>
                                    setForm((f) => ({ ...f, orderId: value }))
                                }
                            >
                                <Picker.Item
                                    label="Selecciona una orden..."
                                    value=""
                                />
                                {orders.map((order) => (
                                    <Picker.Item
                                        key={order.id}
                                        label={`#${order.id} - ${order.details ?? ""}`}
                                        value={String(order.id)}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </>
                )}

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
    pickerWrapper: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 8,
    },
});
