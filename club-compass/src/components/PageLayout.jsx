'use client'
import { Box, Button, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

/**
 * Root page layout — wraps every page with the header and content area.
 * @param {ReactNode} children
 * @param {Array} breadcrumbs - [{label, href}] for the header breadcrumbs
 * @param {Array} actions - [{label, href}] rendered as right-aligned buttons
 */
export default function PageLayout({ children, breadcrumbs = [], actions = [] }) {
  return (
    <Box className="page-layout" minH="100vh" display="flex" flexDirection="column">
      <AppHeader breadcrumbs={breadcrumbs} />
      <Box className="page-content" flex="1">
        {actions.length > 0 && (
          <Flex justify="flex-end" gap={2} className="action-bar">
            {actions.map(({ label, href }, index) => (
              <Button key={index} asChild colorPalette="accent-2" size="xl">
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </Flex>
        )}
        {children}
      </Box>
      <AppFooter />
    </Box>
  )
}
