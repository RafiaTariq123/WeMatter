import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetRecommendedPyschologistsQuery } from "../../redux/api/psychologistAuthApi";
import {
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import Pill from "./Pill";
import StarRating from "../../components/StarRating";
import RatingModal from "../../components/RatingModal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { authApi } from "../../redux/api/authApi";

export default function PsychologistRecommendations() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Get user ID safely - handle different possible structures
  const userId = user?.user?._id || user?._id || "";
  
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  
  const { data, isLoading, isError } = useGetRecommendedPyschologistsQuery({
    _id: userId,
  });

  const handleOpenRatingModal = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedPsychologist(null);
  };

  const handleRatingSubmitted = () => {
    // Refetch the data to update ratings
    // This will trigger a refetch of the psychologist data
    window.location.reload();
  };


  const settings = {
    dots: false,
    infinite: true, 
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !data?.psychologists?.length) {
    return (
      <p className="text-center text-gray-500 font-secondaryFont">
        No recommendations available.
      </p>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        color="primary.main"
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Psychologist Recommendations
      </Typography>

      <Slider {...settings}>
        {data.psychologists.map((psychologist) => (
          <div key={psychologist._id}>
            <PsychologistCard 
              psychologist={psychologist} 
              onRateClick={handleOpenRatingModal}
            />
          </div>
        ))}
      </Slider>

      <RatingModal
        open={ratingModalOpen}
        onClose={handleCloseRatingModal}
        psychologistId={selectedPsychologist?._id}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </>
  );
}

const PsychologistCard = ({ psychologist, onRateClick }) => (
  <Card
    sx={{
      width: 300,
      m: 1,
      boxShadow: 3,
    }}
  >
    <CardContent>
      <Typography variant="h6">
        {psychologist.firstName} {psychologist.lastName}
      </Typography>
      
      <Box sx={{ mt: 1, mb: 1 }}>
        <StarRating 
          rating={psychologist.ratings?.averageRating || 0} 
          count={psychologist.ratings?.ratingCount || 0}
          size="small"
        />
      </Box>
      
      <Typography variant="body2" color="textSecondary">
        Email: {psychologist.email}
      </Typography>

      <Box mt={2}>
        <Typography variant="subtitle2" fontWeight="bold">
          Specialization:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {psychologist.labels?.map((label, index) => (
            <Pill key={index} value={label} />
          ))}
        </Box>
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle2" fontWeight="bold">
          Common Labels:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {psychologist.commonLabels?.length > 0 ? (
            psychologist.commonLabels.map((label, index) => (
              <Pill key={index} value={label} />
            ))
          ) : (
            <Typography>No common labels</Typography>
          )}
        </Box>
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle2" fontWeight="bold">
          Fee per Session:{" "}
          <Box
            component="span"
            sx={{
              backgroundColor: "#f8dada",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontWeight: 600,
              ml: 1,
            }}
          >
            Rs. {psychologist.fee}
          </Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button
          variant="contained"
          component={Link}
          to={`/dashboard/psychologist/profile/${psychologist._id}`}
          sx={{
            bgcolor: "primary.main",
            flex: 1,
            textTransform: "uppercase",
          }}
        >
          View Profile
        </Button>
        <Button
          variant="outlined"
          onClick={() => onRateClick && onRateClick(psychologist)}
          sx={{
            flex: 1,
            textTransform: "uppercase",
          }}
        >
          Rate
        </Button>
      </Box>
    </CardContent>
  </Card>
);
