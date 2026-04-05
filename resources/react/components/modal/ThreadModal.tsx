import { useEffect, useState } from 'react'
import Modal from '../shared/Modal'
import Input from '../shared/Input'
import Textarea from '../shared/TextArea'
import { toast } from 'react-toastify'
import { createThread } from '../../services/threads'

export default function ThreadModal({
    form,
    modalAction,
    isOpen,
    setIsOpen,
    fetchThreads,
}: {
    form: any
    modalAction: 'create' | 'edit'
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    fetchThreads: () => void
}) {
    const [formData, setFormData] = useState(form)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setFormData({
            protocol_id: form?.protocol_id || -1,
            title: form?.title || '',
            body: form?.body || '',
        })
    }, [form])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const clearForm = () => {
        setFormData({
            protocol_id: -1,
            title: '',
            body: '',
        })
        setIsOpen(false)
    }

    const onClose = () => {
        clearForm()
    }

    const onConfirm = () => {
        if (!formData) {
            toast.error('Please fill in all fields')
            return
        }

        setIsLoading(true)
        const response = createThread(formData.protocol_id, formData.title, formData.body)

        toast.promise(response, {
            pending: 'Creating thread...',
            success: 'Thread created successfully',
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message || error.response.data.error || 'Login failed'
                    )
                },
            },
        })

        response.then((response) => {
            clearForm()
            setIsLoading(false)
            fetchThreads()
        })

        response.catch(() => {
            setIsLoading(false)
        })
    }

    return (
        <Modal
            title={modalAction === 'create' ? 'Create Thread' : 'Edit Thread'}
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
        >
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                    Title
                </label>
                <Input
                    name="title"
                    type="text"
                    value={formData.title}
                    placeholder=""
                    handleChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="body" className="block text-gray-700 mb-2">
                    Body
                </label>
                <Textarea
                    name="body"
                    value={formData.body}
                    placeholder=""
                    handleChange={handleChange}
                    required
                />
            </div>
        </Modal>
    )
}
