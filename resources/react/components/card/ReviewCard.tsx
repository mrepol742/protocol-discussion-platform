import { Rating } from 'react-simple-star-rating'
/**
 * ReviewCard component to display individual reviews with user information and rating.
 *
 * @param review - The review object containing feedback, rating, and user information.
 * @param user - The currently logged-in user to determine if the review belongs to them.
 * @returns A styled card component displaying the review details and rating.
 */
export default function ReviewCard({ review, user }) {
    return (
        <div className="hover:border-l-yellow-500 border-l-3 border-gray-500 rounded ps-2 transition">
            {review.user_id === user?.id && (
                <div className="mb-1 bg-gray-600 w-min whitespace-nowrap text-white rounded text-xs px-2">
                    Your review
                </div>
            )}
            <h3 className="font-semibold">{review.user.name}</h3>
            <p className="text-gray-600">{review.feedback}</p>

            <div className="mt-1">
                <Rating
                    initialValue={review.rating}
                    allowHover={false}
                    disableFillHover
                    readonly={true}
                    allowFraction
                    SVGstyle={{
                        width: '16px',
                        height: '16px',
                        display: 'inline-block',
                    }}
                    fillStyle={{ display: 'inline-block' }}
                />
            </div>
        </div>
    )
}
