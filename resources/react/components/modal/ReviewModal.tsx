import { useEffect, useState } from 'react'
import Modal from '../shared/Modal'
import Textarea from '../shared/TextArea'
import { toast } from 'react-toastify'
import { Rating } from 'react-simple-star-rating'
import { submitReview } from '../../services/reviews'

export default function ReviewModal({
    form,
    modalAction,
    isOpen,
    setIsOpen,
    fetchReviews,
}: {
    form: any
    modalAction: 'create' | 'edit'
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    fetchReviews: () => void
}) {
    const [formData, setFormData] = useState(form)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setFormData({
                protocol_id: form?.protocol_id || -1,
                user_id: form?.user_id || -1,
                rating: form?.rating || 0,
                feedback: form?.feedback || '',
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
            user_id: -1,
            rating: 0,
            feedback: '',
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
        const response = submitReview(formData.protocol_id, formData.feedback, formData.rating)

        toast.promise(response, {
            pending: 'Submitting review...',
            success: 'Review submitted successfully',
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message || error.response.data.error || 'Failed to submit review'
                    )
                },
            },
        })

        response.then((response) => {
            clearForm()
            setIsLoading(false)
            fetchReviews()
        })

        response.catch(() => {
            setIsLoading(false)
        })
    }

    const handleRating = (rate) => {
        setFormData({
            ...formData,
            rating: rate, // Convert 0-100 to 0-5
        })
    }

    return (
        <Modal
            title={modalAction === 'create' ? 'Create Review' : 'Edit Review'}
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
        >
            <div className="mb-4">
                <label htmlFor="feedback" className="block text-gray-700 mb-2">
                    Your feedback
                </label>
                <Textarea
                    name="feedback"
                    value={formData.feedback}
                    placeholder=""
                    handleChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4 flex items-center">
                <Rating
                    onClick={handleRating}
                    initialValue={formData.rating}
                    allowFraction
                    transition
                    SVGstyle={{ display: 'inline-block' }}
                    fillStyle={{ display: 'inline-block' }}
                />
            </div>
        </Modal>
    )
}
