import { useEffect, useState } from 'react'
import Modal from '../shared/Modal'
import Textarea from '../shared/TextArea'
import { toast } from 'react-toastify'
import { updateComment } from '../../services/comments'
import { useNavigate } from 'react-router-dom'

export default function CommentModal({
    form,
    isOpen,
    setIsOpen,
}: {
    form: any
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}) {
    const [formData, setFormData] = useState(form)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            setFormData({
                id: form?.id || -1,
                title: form?.title || '',
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
            id: -1,
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
        const response = updateComment(formData.id, formData.title)

        toast.promise(response, {
            pending: 'Updating comment...',
            success: 'Comment updated successfully',
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message ||
                        error.response.data.error ||
                        'Comment update failed'
                    )
                },
            },
        })

        response.then((response) => {
            clearForm()
            setIsLoading(false)
            navigate(0) // Refresh the page to show the updated comment
        })

        response.catch(() => {
            setIsLoading(false)
        })
    }

    return (
        <Modal
            title="Edit Comment"
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
        >
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                    Write a comment
                </label>
                <Textarea
                    name="title"
                    value={formData.title}
                    placeholder=""
                    handleChange={handleChange}
                    required
                />
            </div>
        </Modal>
    )
}
