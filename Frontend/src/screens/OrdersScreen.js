// src/screens/OrdersScreen.js
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
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder,
} from "../api/ordersApi";
import { getAllCustomers } from "../api/customersApi";

export default function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [form, setForm] = useState({
        id: null,
        orderDate: "",
        price: "",
        details: "",
        customerId: "", // lo guardamos como string para el Picker
    });

    // 🔹 Cargar todas las órdenes
    const formatDateToYYYYMMDD = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const dateString = formatDateToYYYYMMDD(selectedDate);
            setForm((f) => ({ ...f, orderDate: dateString }));
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await getAllOrders();
            setOrders(res.data); // List<OrderResponse>
        } catch (err) {
            console.error("Error fetching orders:", err);
            Alert.alert("Error", "No se pudieron cargar las órdenes");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Cargar todos los clientes
    const loadCustomers = async () => {
        try {
            const res = await getAllCustomers();
            console.log("Clientes:", res.data); // 👈 revisa en consola qué campos trae
            setCustomers(res.data); // List<CustomerResponse>
        } catch (err) {
            console.error("Error cargando clientes:", err);
        }
    };



    // Primera carga al montar
    useEffect(() => {
        loadOrders();
        loadCustomers();
    }, []);


    const checkDateRange = (dateString, value, unit, type) => {
        // 1. Obtener la fecha seleccionada
        const selectedDate = new Date(dateString);
        selectedDate.setHours(0, 0, 0, 0); // Limpiar la hora para comparar solo fechas

        // 2. Obtener la fecha de referencia (Hoy)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 3. Calcular la fecha límite (boundary date)
        const boundaryDate = new Date(today);

        switch (unit) {
            case 'days':
                // Si es 'max', restamos; si es 'min', sumamos (la lógica está invertida para la comparación)
                boundaryDate.setDate(boundaryDate.getDate() + (type === 'max' ? -value : value));
                break;
            case 'weeks':
                boundaryDate.setDate(boundaryDate.getDate() + (type === 'max' ? -value * 7 : value * 7));
                break;
            case 'months':
                boundaryDate.setMonth(boundaryDate.getMonth() + (type === 'max' ? -value : value));
                break;
            case 'years':
                boundaryDate.setFullYear(boundaryDate.getFullYear() + (type === 'max' ? -value : value));
                break;
            default:
                return true;
        }

        // 4. Realizar la comparación
        if (type === 'max') {
            // Validación MÁXIMO: La fecha seleccionada DEBE ser posterior o igual a la fecha límite
            return selectedDate >= boundaryDate;
        } else if (type === 'min') {
            // Validación MÍNIMO: La fecha seleccionada DEBE ser anterior o igual a la fecha límite
            return selectedDate <= boundaryDate;
        }

        return false;
    };

    const checkPriceRange = (price, min, max) => {
        return price >= min && price <= max;
    };

    // 🔹 Editar una orden
    const handleEdit = (order) => {
        setForm({
            id: order.id,
            orderDate: order.orderDate || "",
            price: order.price != null ? String(order.price) : "",
            details: order.details || "",
            customerId:
                order.customerId != null ? String(order.customerId) : "",
        });
    };

    // 🔹 Eliminar una orden
    const handleDelete = (id) => {
        Alert.alert("Confirmar", "¿Eliminar esta orden?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteOrder(id);
                        await loadOrders();
                    } catch (err) {
                        console.error("Error deleting order:", err);
                        Alert.alert("Error", "No se pudo eliminar la orden");
                    }
                },
            },
        ]);
    };
    const normalizeDate = (str) => {
        if (!str) return "";
        // reemplaza / por -
        return str.replace(/\//g, "-");
    };

    // 🔹 Guardar nueva o actualizar orden
    const handleSubmit = async () => {

        const priceRegex = /^[0-9]+(\.[0-9]+)?$/;

        if(!form.orderDate || !form.price) {
            Alert.alert("Error", "Por favor ponga la fecha o el precio");
            return;
        }

        if (!form.customerId) {
            Alert.alert("Error", "Selecciona un cliente");
            return;
        }

        if(!checkDateRange(form.orderDate, 3, 'years', 'min')) {
            Alert.alert("Error", "La orden debe ser máximo dentro de 3 años");
            return;
        }

        if (!priceRegex.test(form.price)) {
            Alert.alert("Error", "El precio debe ser un número válido (sin letras)");
            return;
        }

        const priceNumber = form.price ? Number(form.price) : 0;

        if (!checkPriceRange(form.price, 1 , 1000)) {
            Alert.alert("Error", "El precio debe estar entre el rango de 1 y 1000");
            return;
        }

        if (!form.orderDate || form.orderDate.trim() === "") {
            Alert.alert("Error", "La fecha es obligatoria");
            return;
        }


        const payload = {
            // si no ponen fecha, usamos hoy. Si ponen con /, la normalizamos.
            orderDate: normalizeDate(form.orderDate) || new Date().toISOString().slice(0, 10),
            price: priceNumber,
            details: form.details || "",
            customerId: Number(form.customerId),
        };


        try {
            setSaving(true);
            if (form.id) {
                await updateOrder(form.id, payload);
            } else {
                await createOrder(payload);
            }

            setForm({
                id: null,
                orderDate: "",
                price: "",
                details: "",
                customerId: "",
            });

            await loadOrders();
        } catch (err) {
            console.error("Error saving order:", err);
            Alert.alert("Error", "No se pudo guardar la orden");
        } finally {
            setSaving(false);
        }
    };

    // 🔹 Obtener el nombre del cliente basado en el `customerId`
    const getCustomerName = (customerId) => {
        const c = customers.find((x) => x.id === customerId);
        if (!c) return "N/D";

        // si tu backend usa `name`, úsalo; si usa firstName/lastName, armamos el nombre
        if (c.name) return c.name;
        const full = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
        return full || `Cliente #${c.id}`;
    };

    // 🔹 Renderizar cada orden
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Orden #{item.id}</Text>
            <Text style={styles.text}>Fecha: {item.orderDate}</Text>
            <Text style={styles.text}>Precio: ${item.price}</Text>
            <Text style={styles.text}>Detalles: {item.details}</Text>
            <Text style={styles.text}>
                Cliente: {getCustomerName(item.customerId)}
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Órdenes</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    style={{ flex:1 }}
                    contentContainerStyle={{ paddingBottom: 350 }}
                />
            )}

            {/* Formulario de crear/editar orden */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {form.id ? "Editar orden" : "Nueva orden"}
                </Text>

                <Text style={{ marginBottom: 4, fontWeight: "600" }}>Fecha de la orden</Text>
                <TouchableOpacity
                    style={styles.input} // Reutiliza el estilo del input para la apariencia
                    onPress={() => setShowDatePicker(true)} // Abre el selector
                >
                    <Text style={form.orderDate ? { color: "#000" } : { color: "#999" }}>
                        {form.orderDate || "Selecciona la fecha (YYYY-MM-DD)"}
                    </Text>
                </TouchableOpacity>

                {/* 2. SELECTOR DE FECHA (Aparece condicionalmente) */}
                {showDatePicker && (
                    <DateTimePicker
                        // Aquí usamos la fecha del formulario, o la de hoy si no hay
                        value={form.orderDate ? new Date(form.orderDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeDate} // La función que guarda la fecha seleccionada
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Precio"
                    value={form.price}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, price: text }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Detalles (opcional)"
                    value={form.details}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, details: text }))
                    }
                />

                {/* 🔽 Picker para seleccionar cliente */}
                <Text style={{ marginBottom: 4, fontWeight: "600" }}>
                    Cliente
                </Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.customerId || ""}
                        onValueChange={(value) =>
                            setForm((f) => ({ ...f, customerId: value }))
                        }
                    >
                        <Picker.Item
                            label="Selecciona un cliente..."
                            value=""
                        />
                        {customers.map((c) => {
                            const label =
                                c.name ||
                                `${c.firstName ?? ""} ${
                                    c.lastName ?? ""
                                }`.trim() ||
                                `Cliente #${c.id}`;
                            return (
                                <Picker.Item
                                    key={c.id}
                                    label={label}
                                    value={String(c.id)}
                                />
                            );
                        })}
                    </Picker>
                </View>

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
    pickerWrapper: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 8,
    },
});
