'use client'
import { Button, Card, Alert, Fieldset, HStack, Text, Box } from '@chakra-ui/react'
import PageLayout from '@/components/PageLayout'
import PageTransition from '@/components/PageTransition'

const FormPage = ({
  title,
  description,
  breadcrumbs = [],
  globalError,
  handleSubmit,
  submitLabel = 'Submit',
  submitLoadingLabel = 'Submitting…',
  loading = false,
  submitDisabled = false,
  contentLoading = false,
  maxWidth = 480,
  current, // optional current step number for flows
  total, // optional total steps for flows
  children,
}) => {
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTransition>
        <div style={{ maxWidth, margin: '2rem auto' }}>
          <Card.Root className="app-card">
            <Card.Header>
              <HStack justify="space-between" align="flex-start">
                <div>
                  <Card.Title className="card-title">{title}</Card.Title>
                  {description && <Card.Description className="card-description">{description}</Card.Description>}
                </div>
                {current !== undefined && total !== undefined && (
                  <Text mt="1" fontSize="md" color="gray.400" fontStyle="italic" whiteSpace="nowrap">
                    Step {current} of {total}
                  </Text>
                )}
              </HStack>
            </Card.Header>
            {globalError && (
              <Box p="1rem">
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Description>{globalError}</Alert.Description>
                </Alert.Root>
              </Box>
            )}
            <Card.Body>
              {contentLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2.5rem 0' }}>
                  <div className="loader"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Fieldset.Root size="lg">
                    <Fieldset.Content>{children}</Fieldset.Content>
                    <Button
                      type="submit"
                      size="lg"
                      mt={4}
                      colorPalette="accent"
                      disabled={loading || submitDisabled}
                      loading={loading}
                      loadingText={submitLoadingLabel}
                    >
                      {submitLabel}
                    </Button>
                  </Fieldset.Root>
                </form>
              )}
            </Card.Body>
          </Card.Root>
        </div>
      </PageTransition>
    </PageLayout>
  )
}

export default FormPage
