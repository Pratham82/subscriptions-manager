I want to setup a supabase backend with this projec, I have already created a supabsed project

I want you to setup following things

env variables
supabase client

I have got following things from supabse

env.local

EXPO_PUBLIC_SUPABASE_URL=https://crmjvkytxhaksdzzfauw.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_LHtTq0xSnMF03NLmj1wpAQ_0WaVviji

utils/supabse.ts

import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

export const supabase = createClient(
process.env.EXPO_PUBLIC_SUPABASE_URL!,
process.env.EXPO_PUBLIC_SUPABASE_KEY!,
{
auth: {
storage: AsyncStorage,
autoRefreshToken: true,
persistSession: true,
detectSessionInUrl: false,
lock: processLock,
},
})

sb*secret_YuU8YVO960qiYliHC_ezDQ*-16--me\_

EXPO_PUBLIC_SUPABASE_URL=https://crmjvkytxhaksdzzfauw.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_LHtTq0xSnMF03NLmj1wpAQ_0WaVviji
