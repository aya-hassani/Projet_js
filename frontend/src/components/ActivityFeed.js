import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ActivityFeed = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des activités:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [projectId]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal des activités</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.text}>
              <Text style={styles.user}>{item.user.name}</Text> {item.action} 
              <Text style={styles.date}> {new Date(item.createdAt).toLocaleString()}</Text>
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  activityItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  text: { fontSize: 14 },
  user: { fontWeight: 'bold' },
  date: { color: '#666', fontSize: 12 }
});

export default ActivityFeed;