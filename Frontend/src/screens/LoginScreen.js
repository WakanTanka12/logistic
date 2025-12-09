// src/screens/LoginScreen.js
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
import { useAuth } from "../hooks/useAuth";

const LoginScreen = ({ navigation }) => {
    const { login, loading } = useAuth();
    const [username, setUsername] = useState(""); // email
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Por favor ingresa usuario y contraseña");
            return;
        }

        const success = await login(username, password);

        if (success) {
            Alert.alert("Bienvenido", "Has iniciado sesión correctamente");
        } else {
            Alert.alert("Acceso denegado", "Credenciales inválidas. Intenta nuevamente.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>EMS — Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
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
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                )}
            </TouchableOpacity>

            {/* 👉 Enlace para ir a Register */}
            <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                style={{ marginTop: 16 }}
            >
                <Text style={{ textAlign: "center", color: "#2A4B9A" }}>
                    ¿No tienes cuenta? Crear cuenta
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
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

export default LoginScreen;
