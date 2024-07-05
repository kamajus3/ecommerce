import { env } from '@/env'
import { init } from '@emailjs/browser'

init({
  publicKey: env.NEXT_PUBLIC_EMAILJS_KEY,
  limitRate: {
    id: 'app',
    throttle: 10000,
  },
})
