import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';

export default function ProtectedLayout() {
  const { session } = useAuth();

  if (!session) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
