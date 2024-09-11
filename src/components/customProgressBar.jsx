import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

export default function CustomProgressBar({ value }) {
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
        },
    }));

    return (
        <div>
            <BorderLinearProgress color={value > 90? 'error': value > 70? 'warning': 'info'} variant="determinate" value={value} sx={{ position: 'relative'}}/>
        </div>
    );
}