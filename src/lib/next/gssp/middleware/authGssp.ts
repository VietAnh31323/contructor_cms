import { END_POINT_CHECK_TENANT_EXIST } from '@/service/uaa/tenant'
import getConfig from 'next/config'
import { RedirectError, RedirectProps } from '../error'
import { GsspMiddleware } from '../type'

export const authGssp =
  (
    redirectPropsToLogin: RedirectProps = {
      permanent: false,
      destination: '/login',
    },
  ): GsspMiddleware =>
    async (...args) => {
      const token = args[0].req.cookies.ACCESS_TOKEN
      if (!token) throw new RedirectError(redirectPropsToLogin)

      const domain = args[0]?.req?.headers?.host

      if (domain && domain.includes('localhost')) {
        return [...args, true]
      }

      try {
        if (domain) {
          const {
            publicRuntimeConfig: { UAA_URL },
          } = getConfig()

          const response = await fetch(
            UAA_URL +
            END_POINT_CHECK_TENANT_EXIST +
            '?' +
            `domain=` +
            domain.replace('https://', '').replace('http://', ''),
          )

          let data = await response.json()

          return [...args, !!data?.data]
        }
      } catch (error) {
        console.log('error', error)
      }
      return [...args, false]
    }
