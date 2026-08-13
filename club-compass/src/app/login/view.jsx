'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Alert, Box, Button, Heading, Image, Text, VStack } from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { authClient } from '@/lib/auth-client'

function parseErrorMessage(error) {
  if (!error) return null
  return error
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function View() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const errorMessage = parseErrorMessage(searchParams.get('error'))

  async function handleGoogleSignIn() {
    setLoading(true)
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
    setLoading(false)
  }

  return (
    <Box minH="100vh" px={4} display="flex" alignItems="center" justifyContent="center" className="login-bg">
      <Box className="app-card" p={10} borderRadius="2xl" maxW="400px" w="full" textAlign="center">
        <VStack gap={6}>
          <Box>
            <Image src="/img/adventurer-logo.png" alt="Adventurer Logo" mx="auto" mb={4} h="200px" />
            <Heading size="2xl" mb={2}>
              Club Compass
            </Heading>
            <Text>Sign in to access the app</Text>
          </Box>

          {errorMessage && (
            <Alert.Root status="error" borderRadius="lg">
              <Alert.Indicator />
              <Alert.Description>{errorMessage}</Alert.Description>
            </Alert.Root>
          )}

          <Button
            onClick={handleGoogleSignIn}
            loading={loading}
            loadingText="Signing in…"
            colorPalette="accent"
            size="xl"
            w="full"
            gap={3}
          >
            <FcGoogle size={22} />
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}
