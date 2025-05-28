import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Grow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormatListBulleted } from '@mui/icons-material';

export default function EnhancedFoliosList({ center }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  // Compute unique folios, filtering out falsy values
  const uniqueFolios = React.useMemo(() => {
    const folios = center.details
      .map((d) => d.ReportFolio)
      .filter((f) => f);
    return Array.from(new Set(folios));
  }, [center.details]);

  return (
    <Grow in>
      <Card elevation={3} sx={{ mt: 2, position: 'relative' }}>
        <CardHeader
          avatar={<FormatListBulleted color="primary" />}
          title={
            <Typography variant={isSm ? 'h6' : 'h5'}>
              Folios
            </Typography>
          }
          subheader={
            <Chip
              label={`${uniqueFolios.length} folio${uniqueFolios.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{ mt: isSm ? 1 : 0 }}
            />
          }
        />
        <Divider />
        <CardContent>
          {uniqueFolios.length > 0 ? (
            <List dense>
              {uniqueFolios.map((folio, idx) => (
                <ListItem key={folio}>
                  <ListItemIcon>
                    <FormatListBulleted fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {`${idx + 1}. ${folio}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No se encontraron folios
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
}
