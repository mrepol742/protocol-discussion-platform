import { useState } from 'react'
import Modal from '../shared/Modal'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteProtocol } from '../../services/protocols'
import { deleteThread } from '../../services/threads'

export default function DeleteModal({
    type,
    item,
    isOpen,
    setIsOpen,
}: {
    type: 'protocol' | 'thread'
    item: any
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}) {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleConfirm = async () => {
        handleDelete()
    }

    const handleDelete = async () => {
        setIsLoading(true)

        let response = getDeleteFunction().call(null, Number(item.id))

        toast.promise(response, {
            pending: `Deleting ${type}...`,
            success: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message ||
                        error.response.data.error ||
                        'Deletion failed'
                    )
                },
            },
        })

        response.then((response) => {
            setIsLoading(false)
            navigate(0) // Refresh the page to show the new protocol
        })

        response.catch(() => {
            setIsLoading(false)
        })

        setIsLoading(false)
    }

    const getDeleteFunction = () => {
        switch (type) {
            case 'protocol':
                return deleteProtocol
            case 'thread':
                return deleteThread
            default:
                throw new Error('Invalid type for deletion')
        }
    }

    return (
        <Modal
            title="Confirm Deletion"
            isOpen={isOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            isLoading={isLoading}
        >
            <p>Are you sure you want to delete this item?</p>
            <p className="text-sm text-gray-500 mt-2">{item.title}</p>
        </Modal>
    )
}
