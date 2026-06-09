import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserSession = async (user: any) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getUserSession = async () => {
  const data = await AsyncStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const clearUserSession = async () => {
  await AsyncStorage.removeItem("user");
};