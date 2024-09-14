import { Card, CardActionArea, CardContent, CardHeader, Collapse, Stack, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { useState } from 'react'
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined';


function getBusynessString(value: number) {
    if (value < 20) {
        return `Empty (${value}%)` 
    } else if (value < 75) {
        return `Busy (${value}%)` 
    } else if (value < 90) {
        return `Very Busy (${value}%)` 
    } else {
        return `Full (${value}%)` 
    }
}

function getComparisonBusynessString(value: number) {
    if (value === -1) {
        return "less busy"
    } else if (value === 0) {
        return "equally as busy"
    } else {
        return "busier"
    }
}

export default function Busyness({isOpen, location, busyness, comparison, peak} : { isOpen: boolean, location: string, busyness: number | undefined, comparison: { hour: number, day: number} | undefined, peak: [String] | undefined}) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
      };

    return (
        <div style={{ margin: "2em" }}>
            <Card>
                <CardActionArea onClick={handleExpandClick}>
                    {isOpen? 
                        (<CardHeader title={location} subheader={getBusynessString(busyness!)} action={
                            <PieChart 
                                series={[
                                    {
                                        data: [{ value: busyness!, color:'#00629B'}],
                                        startAngle: 0,
                                        endAngle: (busyness!/100)*360,
                                        innerRadius: 20,
                                        outerRadius: 30,
                                        cornerRadius: 2,
                                        cx: 30,
                                    }
                                ]}
                                width={70}
                                height={70}
                                tooltip={{ trigger: 'none' }}
                            >
                            </PieChart>
                        }/>) 
                        :
                        (<CardHeader title={location} subheader={"Closed"}/>)
                    }
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent style={{paddingTop: 0}}>
                            {!(comparison === undefined)?
                                <div>
                                    (<Stack direction="row" spacing="0.5rem">
                                        <ShowChartIcon/>
                                        <Typography>Next hour will be <Typography component={'span'} display="inline" sx={{ fontWeight: "bold" }}>{getComparisonBusynessString(comparison!.hour)}</Typography>.</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing="0.5rem">
                                        <LandscapeOutlinedIcon/>
                                        <Typography>Peak hours are at <Typography component={'span'} display="inline" sx={{ fontWeight: "bold" }}>{peak!.join(", ")}</Typography>.</Typography>
                                    </Stack>)
                                </div>
                                :
                                (<Typography>This location is currently closed.</Typography>)}
                            </CardContent>
                    </Collapse>
                </CardActionArea>
            </Card>
        </div>
    )
}

