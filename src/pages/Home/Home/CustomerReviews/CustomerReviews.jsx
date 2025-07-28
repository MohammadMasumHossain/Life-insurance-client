import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/reviews')
      .then(res => setReviews(res.data))
      .catch(err => console.error('Error fetching reviews:', err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-fuchsia-600">What Our Customers Say</h2>

      <Swiper
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        modules={[Pagination, Autoplay]}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id}>
            <div className="bg-sky-50 shadow-md rounded-xl p-6 h-[250px] flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.photo}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-fuchsia-500"
                />
                <div>
                  <h4 className="font-semibold text-lg">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.policyTitle}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 italic overflow-hidden text-ellipsis" style={{ flexGrow: 1 }}>
                "{review.feedback}"
              </p>

              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomerReviews;
