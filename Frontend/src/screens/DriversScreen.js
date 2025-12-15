// src/screens/DriversScreen.js
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
    getAllDrivers,
    deleteDriver,
    updateDriver,
    createDriver,
} from "../api/driversApi";
import { getDeliveriesByDriver } from "../api/deliveriesApi";
import { Picker } from "@react-native-picker/picker";

export default function DriversScreen() {
    const [drivers, setDrivers] = useState([]);
    const [deliveries, setDeliveries] = useState({}); // { [driverId]: DeliveryResponse[] }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        id: null,
        firstName: "",
        lastName: "",
    });


    // 🔹 Cargar todos los conductores
    const loadDrivers = async () => {
        try {
            setLoading(true);
            const res = await getAllDrivers();
            setDrivers(res.data);
        } catch (err) {
            console.error("Error fetching drivers:", err);
            Alert.alert("Error", "No se pudieron cargar los conductores");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Cargar entregas de un conductor
    const loadDeliveriesForDriver = async (driverId) => {
        try {
            const res = await getDeliveriesByDriver(driverId);
            setDeliveries((prev) => ({
                ...prev,
                [driverId]: res.data,
            }));
        } catch (err) {
            console.error("Error fetching deliveries for driver:", err);
        }
    };

    useEffect(() => {
        loadDrivers();
    }, []);

    // Cuando cambian los conductores, cargamos sus entregas
    useEffect(() => {
        drivers.forEach((driver) => {
            if (driver.id) {
                loadDeliveriesForDriver(driver.id);
            }
        });
    }, [drivers]);

    const handleEdit = (driver) => {
        setForm({
            id: driver.id,
            firstName: driver.firstName || "",
            lastName: driver.lastName || "",
        });
    };

    const handleDelete = id => {
      Alert.alert('Confirmar', '¿Eliminar este conductor?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDriver(id);
              await loadDrivers();
            } catch (err) {
              console.error('Error deleting driver:', err);
              Alert.alert('Error', 'No se pudo eliminar el conductor');
            }
          },
        },
      ]);
    };


    const handleSubmit = async () => {

        const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

        if (!onlyLettersRegex.test(form.firstName)) {
          Alert.alert('Error', 'El nombre no debe contener números');
          return;
        }

        if (form.firstName.length < 2 || form.firstName.length > 50) {
          Alert.alert('Error', 'El nombre debe tener entre 2 y 50 carácteres');
          return;
        }

        if (!onlyLettersRegex.test(form.lastName)) {
          Alert.alert('Error', 'El apellido no debe contener números');
          return;
        }

        if (form.lastName.length < 2 || form.lastName.length > 50) {
          Alert.alert('Error', 'El apellido debe tener entre 2 y 50 carácteres');
          return;
        }
        

        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
        };

        try {
            setSaving(true);

            if (form.id) {
                await updateDriver(form.id, payload);
            } else {
                await createDriver(payload);
            }

            setForm({ id: null, firstName: "", lastName: "" });
            await loadDrivers();
        } catch (err) {
            console.error("Error saving driver:", err);
            Alert.alert("Error", "No se pudo guardar el conductor");
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => {
        const driverDeliveries = deliveries[item.id] || [];
        return (
            <View style={styles.card}>
                <Text style={styles.title}>
                    {item.firstName} {item.lastName}
                </Text>

                {/* Relación con las entregas */}
                <View style={styles.deliveriesContainer}>
                    <Text style={styles.deliveriesTitle}>Entregas asignadas:</Text>

                    {driverDeliveries.length === 0 ? (
                        <Text style={styles.text}>
                            Este conductor no tiene entregas asignadas.
                        </Text>
                    ) : (
                        <>
                            {driverDeliveries.map((delivery) => (
                                <Text key={delivery.id} style={styles.text}>
                                    • Entrega #{delivery.id} | Estado: {delivery.status} | Fecha: {delivery.deliveryDate || 'N/A'}
                                </Text>
                            ))}
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Conductores</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={drivers}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    style={{ flex:1 }}
                    contentContainerStyle={{ paddingBottom: 250 }}
                />
            )}

            {/* Formulario para crear o editar conductor */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {form.id ? "Editar conductor" : "Nuevo conductor"}
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
    deliveriesContainer: {
        marginTop: 10,
    },
    deliveriesTitle: {
        fontWeight: "bold",
        marginBottom: 6,
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
