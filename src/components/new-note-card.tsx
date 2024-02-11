import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition

const speechRecognition = new SpeechRecognitionAPI()

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === '') {
      toast.error('Você não pode salvar uma nota vazia!')
      return
    }

    onNoteCreated(content)

    setContent('')
    setShouldShowOnboarding(true)

    toast.success('Nota salva com sucesso!')
  }

  function handleStartRecording() {
    const isSpeechRecognitionSupported =
      'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

    if (!isSpeechRecognitionSupported) {
      toast.error('Seu navegador não suporta reconhecimento de fala!')
      return
    }

    setIsRecording(true)

    setContent('')
    setShouldShowOnboarding(false)

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcript)
    }

    speechRecognition.onerror = (event) => {
      console.error(event.error)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex flex-col gap-3 overflow-hidden rounded-md bg-slate-700 p-5 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-500">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50">
          <Dialog.Content className="fixed left-1/2 top-1/2 flex h-[60dvh] w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md bg-slate-700 outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>

            <form className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>
                {shouldShowOnboarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                    Comece{' '}
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="font-medium text-lime-400 underline-offset-2 hover:underline"
                    >
                      gravando
                    </button>{' '}
                    uma nota em áudio ou se preferir{' '}
                    <button
                      type="button"
                      onClick={handleStartEditor}
                      className="font-medium text-lime-400 underline-offset-2 hover:underline"
                    >
                      utilize apenas texto
                    </button>
                    .
                  </p>
                ) : (
                  <textarea
                    onChange={handleContentChanged}
                    onBlur={handleContentChanged}
                    autoFocus
                    value={content}
                    className="flex-1 resize-none bg-transparent text-sm leading-6 text-slate-400 outline-none"
                  />
                )}
              </div>

              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="flex w-full items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm font-medium text-slate-300 outline-none hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="size-3 animate-pulse rounded-full bg-red-500" />
                  Gravando (clique p/ interromper)
                </button>
              ) : (
                <button
                  type="button"
                  disabled={shouldShowOnboarding || content === ''}
                  onClick={handleSaveNote}
                  className=": w-full bg-lime-400 py-4 text-center text-sm font-medium text-lime-950 outline-none disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled)]:hover:bg-lime-500"
                >
                  Salvar nota
                </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
