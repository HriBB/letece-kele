import { Form } from 'react-router'

// Floating control to leave Visual Editing preview mode (POST clears the cookie,
// see routes/resource/preview.ts).
export function ExitPreview() {
  return (
    <Form
      method="post"
      action="/resource/preview"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <button
        type="submit"
        className="bg-ink text-paper hover:bg-ink/90 rounded-full px-5 py-2.5 text-sm font-bold shadow-lg"
      >
        Zapri predogled
      </button>
    </Form>
  )
}

export default ExitPreview
