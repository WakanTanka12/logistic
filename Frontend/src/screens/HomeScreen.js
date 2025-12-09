// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { getDeliveriesByDriver } from "../api/deliveriesApi"; // 👈 tu API real
import OrderCard from "../components/OrderCard";

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadDeliveries = async () => {
        if (!user?.userId) return;

        try {
            setLoading(true);
            const data = await getDeliveriesByDriver(user.userId);
            setDeliveries(data || []);
        } catch (error) {
            console.log("Error loading deliveries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeliveries();
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View>
                    <Text style={styles.welcome}>
                        Hola, {user?.firstname || "Driver"}
                    </Text>
                    <Text style={styles.subtitle}>Tus entregas de hoy</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Usuario")}>
                    <Text style={styles.link}>Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={logout}>
                    <Text style={[styles.link, { color: "#D9534F" }]}>Salir</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={deliveries}
                keyExtractor={(item) => String(item.id || item.deliveryId)}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() => console.log("Detalle de entrega", item.id)}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadDeliveries} />
                }
                ListEmptyComponent={
                    !loading && (
                        <Text style={styles.empty}>No tienes entregas asignadas.</Text>
                    )
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    welcome: { fontSize: 18, fontWeight: "bold" },
    subtitle: { fontSize: 14, color: "#555" },
    link: { marginLeft: 12, color: "#2A4B9A", fontWeight: "600" },
    empty: { textAlign: "center", marginTop: 32, color: "#777" },
});

export default HomeScreen;
