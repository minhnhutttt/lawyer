import { FaStar } from 'react-icons/fa'

interface RatingStarsProps {
  rating: number
  maxRating?: number
}

export default function RatingStars({ rating, maxRating = 5 }: RatingStarsProps) {
  const stars = []
  const roundedRating = Math.floor(rating)
  
  for (let i = 0; i < maxRating; i++) {
    if (i < roundedRating) {
      stars.push(<span key={i} className="text-yellow-400"><FaStar /></span>)
    } else {
      stars.push(<span key={i} className="text-gray-300"><FaStar /></span>)
    }
  }
  
  return <div className="flex">{stars}</div>
} 