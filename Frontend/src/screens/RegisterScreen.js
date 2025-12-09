// src/screens/RegisterScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { registerUser } from "../api/authService";
import { useAuth } from "../hooks/useAuth";

const RegisterScreen = ({ navigation }) => {
    const { login } = useAuth();

    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!form.firstname || !form.lastname || !form.email || !form.password) {
            Alert.alert("Error", "Completa todos los campos.");
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser(form);

            // iniciar sesión automáticamente después de registrarse
            await login(data.email || form.email, form.password);

            Alert.alert(
                "Registro exitoso",
                `Bienvenido ${data.firstname || form.firstname} ${data.lastname || form.lastname}`
            );
        } catch (err) {
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log("HEADERS:", err.response?.headers);
            Alert.alert("Error", "No se pudo completar el registro.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta — EMS</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={form.firstname}
                onChangeText={(text) => handleChange("firstname", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={form.lastname}
                onChangeText={(text) => handleChange("lastname", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Crear cuenta</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 12 }}
            >
                <Text style={{ textAlign: "center", color: "#2A4B9A" }}>
                    ¿Ya tienes cuenta? Inicia sesión
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#f5f5f5" },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
        color: "#2A4B9A",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    button: {
        backgroundColor: "#2A4B9A",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
