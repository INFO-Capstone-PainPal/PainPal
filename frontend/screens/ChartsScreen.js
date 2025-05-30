import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '@env';

// Helper method to fetch an image as a base64 string
const fetchImageAsBase64 = async (url, token) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }, // Android would not allow fetching in Image tag
  });
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export default function ChartsScreen() {
  const [averageRisk, setAverageRisk] = useState(null);
  const [topTriggers, setTopTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const [monthlyImage, setMonthlyImage] = useState(null);
  const [heatImage, setHeatImage] = useState(null);
  const [countImage, setCountImage] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        setToken(token);
  
        const res = await fetch(`${BASE_URL}/ml/ml/top-triggers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.detail || "Could not get insights");
        }
        
        if (data.warning) {
          setError(data.warning);
        } else {
          setAverageRisk((data.mean_prediction * 100).toFixed(1));
          setTopTriggers(data.top_triggers);
        }
      } catch (err) {
        console.error("Failed to load insights:", err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInsights();
  }, []);  

  useEffect(() => {
    if (!token) return;

    const loadImages = async () => {
      try {
        const [monthly, heat, triggers] = await Promise.all([
          fetchImageAsBase64(`${BASE_URL}/ml/visualizations/monthly`, token),
          fetchImageAsBase64(`${BASE_URL}/ml/visualizations/triggers`, token),
          fetchImageAsBase64(`${BASE_URL}/ml/ml/trigger-graph`, token),
        ]);
        setMonthlyImage(monthly);
        setHeatImage(heat);
        setCountImage(triggers);
      } catch (err) {
        console.error("Failed to load chart images:", err);
      }
    };

    loadImages();
  }, [token]);

  if (loading) {
    return (
      <View style={[styles.container, tw`flex-1`]}>
        <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Insights</Text>
        <View style={[tw`flex-1 justify-center items-center`]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, tw`flex-1`]}
      contentContainerStyle={tw`pb-12`}
    >
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Insights</Text>

      {error ? (
        <View style={[styles.card, tw`mt-4 mx-4`]}>
          <Text style={tw`text-white text-base`}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={[styles.card, tw`mt-4 mx-4`]}>
            <Text style={tw`text-white text-base`}>
              Your average migraine risk:
              <Text style={tw`font-bold`}> {averageRisk}%</Text>
            </Text>
            <Text style={tw`text-white text-base mt-2`}>Top triggers:</Text>
            <Text style={tw`text-white font-bold`}>
              {topTriggers.join(", ")}
            </Text>
          </View>

          <Text style={tw`text-white text-lg font-bold mt-6 ml-5`}>
            Migraines Per Month
          </Text>
          <View style={styles.imageWrapper}>
            {!monthlyImage ? (
              <ActivityIndicator size="large" color="#FFFFFF" style={tw`m-5`} />
            ) : (
              <Image
                source={{ uri: monthlyImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>

          <Text style={tw`text-white text-lg font-bold mt-6 ml-5`}>
            Trigger Correlations
          </Text>
          <View style={styles.imageWrapper}>
            {!heatImage ? (
              <ActivityIndicator size="large" color="#FFFFFF" style={tw`m-5`} />
            ) : (
              <Image
                source={{ uri: heatImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>

          <Text style={tw`text-white text-lg font-bold mt-6 ml-5`}>
            Top 10 Triggers by Count
          </Text>
          <View style={styles.imageWrapper}>
            {!countImage ? (
              <ActivityIndicator size="large" color="#FFFFFF" style={tw`m-5`} />
            ) : (
              <Image
                source={{ uri: countImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B" 
  },
  imageWrapper: {
    borderRadius: 12,
    backgroundColor: "#4D4471",
    marginHorizontal: 20,
    marginTop: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 250
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
    padding: 16
  }
});