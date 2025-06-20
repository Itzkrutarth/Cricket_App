import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { styles } from "../../styles/CoachHomeStyles"
import Header from "./Header_1"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const TaskScreen = () => {
  const router = useRouter()
  const [showPending, setShowPending] = useState(true)
  const [showCompleted, setShowCompleted] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const tasks = useSelector((state: RootState) => state.task.tasks)
  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  const handleTaskPress = (id: string) => {
    setSelectedTaskId((prev) => (prev === id ? null : id))
  }

  const getStudentDetails = (id: string) => {
    // For demo purpose, mapping manually by task ID
    switch (id) {
      case "1":
        return {
          name: "Virat Kohli",
          profileUrl: "https://picsum.photos/200/200?random=1",
          videos: [
            {
              title: "Net Practice Drive",
              thumbnail: "https://picsum.photos/400/225?random=11",
              duration: "4:20",
            },
          ],
        }
      case "2":
        return {
          name: "Rohit Sharma",
          profileUrl: "https://picsum.photos/200/200?random=2",
          videos: [
            {
              title: "Warm-Up Drill",
              thumbnail: "https://picsum.photos/400/225?random=12",
              duration: "3:10",
            },
          ],
        }
      default:
        return null
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Header title="Tasks" />

      <View style={{ paddingLeft: 5 }}>
        {/* Pending Section */}
        <TouchableOpacity
          onPress={() => setShowPending((prev) => !prev)}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>
            Pending Tasks ({pendingTasks.length})
          </Text>
          <Feather
            name={showPending ? "chevron-up" : "chevron-down"}
            size={20}
          />
        </TouchableOpacity>

        {showPending &&
          pendingTasks.map((task) => {
            const student = getStudentDetails(task.id)
            return (
              <View key={task.id}>
                <TouchableOpacity
                  style={styles.taskItem}
                  onPress={() => handleTaskPress(task.id)}
                >
                  <Text style={styles.taskText}>{task.title}</Text>
                </TouchableOpacity>

                {selectedTaskId === task.id && student && (
                  <View
                    style={{
                      backgroundColor: "#f9fafb",
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={{ uri: student.profileUrl }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                      />
                      <Text style={{ fontSize: 16, fontWeight: "600" }}>
                        {student.name}
                      </Text>
                    </View>

                    <View style={{ marginTop: 12 }}>
                      {student.videos.map((video, index) => (
                        <View key={index} style={{ marginBottom: 12 }}>
                          <Image
                            source={{ uri: video.thumbnail }}
                            style={{
                              width: "100%",
                              height: 180,
                              borderRadius: 8,
                            }}
                          />
                          <Text style={{ marginTop: 6, fontWeight: "500" }}>
                            {video.title}
                          </Text>
                          <Text style={{ color: "#666" }}>
                            Duration: {video.duration}
                          </Text>
                          <TouchableOpacity
                            style={{
                              marginTop: 6,
                              backgroundColor: "#4e73df",
                              padding: 8,
                              borderRadius: 6,
                              alignItems: "center",
                            }}
                            onPress={() =>
                              router.push({
                                pathname: "/coach-home/videoAnnotation",
                                params: {
                                  title: video.title,
                                  videoSource: video.thumbnail,
                                  taskId: task.id,
                                },
                              })
                            }
                          >
                            <Text style={{ color: "#fff" }}>
                              Open for Annotation
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )
          })}

        {/* Completed Section */}
        <TouchableOpacity
          onPress={() => setShowCompleted((prev) => !prev)}
          style={[styles.sectionHeader, { marginTop: 24 }]}
        >
          <Text style={styles.sectionTitle}>
            Completed Tasks ({completedTasks.length})
          </Text>
          <Feather
            name={showCompleted ? "chevron-up" : "chevron-down"}
            size={20}
          />
        </TouchableOpacity>

        {showCompleted &&
          completedTasks.map((task) => (
            <View key={task.id} style={styles.taskItemCompleted}>
              <Text style={styles.taskText}>{task.title}</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  )
}

export default TaskScreen
