const user = {
  id: 279058397,
  first_name: 'Vladislav',
  last_name: 'Kibenko',
  username: 'vdkfrost',
  language_code: 'ru',
  is_premium: true,
  allows_write_to_pm: true,
  photo_url: 'https://t.me/i/userpic/320/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg',
}

// Define the components of tgWebAppData
const auth_date = '1736409902'
const chat_instance = '-9019086117643313246'
const chat_type = 'sender'
const signature = 'FNWSy6kv5n4kkmYYmfTbrgRtswTvwXgHTRWBVjp-YOv2srtMFSYCWZ9nGr_PohWZeWcooFo_oQgsnTJge3JdBA'
const hash = '4c710b1d446dd4fd301c0efbf7c31627eca193a2e657754c9e0612cb1eb71d90'

// Construct tgWebAppData by encoding the user JSON and combining with other parameters
const tgWebAppData = [
  `user=${encodeURIComponent(JSON.stringify(user))}`,
  `chat_instance=${chat_instance}`,
  `chat_type=${chat_type}`,
  `auth_date=${auth_date}`,
  `signature=${signature}`,
  `hash=${hash}`,
].join('&')

// Define the theme parameters
const themeParams = {
  accent_text_color: '#6ab3f2',
  bg_color: '#17212b',
  bottom_bar_bg_color: '#17212b',
  button_color: '#5289c1',
  button_text_color: '#ffffff',
  destructive_text_color: '#ec3942',
  header_bg_color: '#17212b',
  hint_color: '#708599',
  link_color: '#6ab3f3',
  secondary_bg_color: '#232e3c',
  section_bg_color: '#17212b',
  section_header_text_color: '#6ab3f3',
  section_separator_color: '#111921',
  subtitle_text_color: '#708599',
  text_color: '#f5f5f5',
}

// Construct the launchParams string
const launchParams = [
  `tgWebAppData=${encodeURIComponent(tgWebAppData)}`,
  `tgWebAppVersion=8.0`,
  `tgWebAppPlatform=tdesktop`,
  `tgWebAppThemeParams=${encodeURIComponent(JSON.stringify(themeParams))}`,
].join('&')

export { launchParams }
