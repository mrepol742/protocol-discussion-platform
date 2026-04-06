import { useEffect, useState } from 'react'
import Modal from '../shared/Modal'
import Input from '../shared/Input'
import Textarea from '../shared/TextArea'
import { toast } from 'react-toastify'
import { createThread, updateThread } from '../../services/threads'
import { useNavigate } from 'react-router-dom'

export default function ThreadModal({
    form,
    modalAction,
    isOpen,
    setIsOpen,
}: {
    form: any
    modalAction: 'create' | 'edit'
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}) {
    const [formData, setFormData] = useState(form)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            setFormData({
                protocol_id: form?.protocol_id || -1,
                id: form?.id || -1,
                title: form?.title || '',
                body: form?.body || '',
            })
        }
    }, [form, isOpen])

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
            id: -1,
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

        if (modalAction === 'create') {
            handleCreate()
        } else if (modalAction === 'edit') {
            handleUpdate()
        }
    }

    const handleCreate = async () => {
        setIsLoading(true)
        const response = createThread(formData.protocol_id, formData.title, formData.body)

        toast.promise(response, {
            pending: 'Creating thread...',
            success: 'Thread created successfully',
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message ||
                        error.response.data.error ||
                        'Thread creation failed'
                    )
                },
            },
        })

        response.then((response) => {
            clearForm()
            setIsLoading(false)
            navigate(0) // Refresh the page to show the new thread in the list
        })

        response.catch(() => {
            setIsLoading(false)
        })
    }

    const handleUpdate = async () => {
        setIsLoading(true)
        const response = updateThread(
            formData.id,
            formData.title,
            formData.body,
        )

        toast.promise(response, {
            pending: 'Updating thread...',
            success: 'Thread updated successfully',
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message ||
                        error.response.data.error ||
                        'Thread update failed'
                    )
                },
            },
        })

        response.then((response) => {
            clearForm()
            setIsLoading(false)
            navigate(0) // Refresh the page to show the new thread in the list
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
