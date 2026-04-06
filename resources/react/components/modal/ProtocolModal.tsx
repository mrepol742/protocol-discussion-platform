import { useEffect, useState } from 'react'
import Modal from '../shared/Modal'
import Input from '../shared/Input'
import Textarea from '../shared/TextArea'
import { createProtocol } from '../../services/protocols'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function ProtocolModal({
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
    const [tagsInput, setTagsInput] = useState(form?.tags?.join(', ') || '')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

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

        setIsLoading(true)
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
            setIsLoading(false)
            navigate(0) // Refresh the page to show the new protocol
        })

        response.catch(() => {
            setIsLoading(false)
        })
    }

    return (
        <Modal
            title={modalAction === 'create' ? 'Create Protocol' : 'Edit Protocol'}
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
