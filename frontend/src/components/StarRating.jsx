import React from 'react';
import { Box, Typography } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

const StarRating = ({ rating, size = 'medium', showCount = true, count = 0 }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            sx={{
              color: '#ffc107',
              fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
            }}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Box key={i} sx={{ position: 'relative', display: 'inline-block' }}>
            <StarBorder
              sx={{
                color: '#ffc107',
                fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
              }}
            />
            <Star
              sx={{
                color: '#ffc107',
                fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                overflow: 'hidden',
              }}
            />
          </Box>
        );
      } else {
        stars.push(
          <StarBorder
            key={i}
            sx={{
              color: '#ffc107',
              fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
            }}
          />
        );
      }
    }
    
    return stars;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {renderStars()}
      </Box>
      {showCount && (
        <Typography variant="body2" color="textSecondary">
          ({count})
        </Typography>
      )}
    </Box>
  );
};

export default StarRating;
