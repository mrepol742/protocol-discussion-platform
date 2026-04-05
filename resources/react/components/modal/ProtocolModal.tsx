import { useEffect, useState } from 'react'
import Modal from '../shared/Modal'
import Input from '../shared/Input'
import Textarea from '../shared/TextArea'
import { createProtocol } from '../../services/protocols'
import { toast } from 'react-toastify'

export default function ProtocolModal({
    form,
    modalAction,
    isOpen,
    setIsOpen,
    fetchProtocols,
}: {
    form: any
    modalAction: 'create' | 'edit'
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    fetchProtocols: () => void
}) {
    const [formData, setFormData] = useState(form)
    const [tagsInput, setTagsInput] = useState(form?.tags?.join(', ') || '')

    useEffect(() => {
        setFormData({
            title: form?.title || '',
            content: form?.content || '',
            tags: form?.tags || [],
        })
    }, [form])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === 'tags') {
            setTagsInput(value)
            setFormData({
                ...formData,
                tags: value
                    .split(',') // split by comma
                    .map((tag) => tag.trim()) // remove spaces
                    .filter((tag) => tag !== ''), // remove empty values
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
    }

    const clearForm = () => {
        setFormData({
            title: '',
            content: '',
            tags: [],
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

        const response = createProtocol(formData.title, formData.content, formData.tags)

        toast.promise(response, {
            pending: 'Creating protocol...',
            success: 'Protocol created successfully',
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
            fetchProtocols()
        })

        response.catch(() => {})
    }

    return (
        <Modal
            title={modalAction === 'create' ? 'Create Protocol' : 'Edit Protocol'}
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
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
                <label htmlFor="content" className="block text-gray-700 mb-2">
                    Content
                </label>
                <Textarea
                    name="content"
                    value={formData.content}
                    placeholder=""
                    handleChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="tags" className="block text-gray-700 mb-2">
                    Tags
                </label>
                <Input
                    name="tags"
                    type="text"
                    value={tagsInput}
                    placeholder="e.g. api, backend, auth"
                    handleChange={handleChange}
                    required
                />
                <span className="text-xs text-gray-500">Separate tags with commas</span>
            </div>
        </Modal>
    )
}
