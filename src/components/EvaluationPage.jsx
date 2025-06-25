import React, { useEffect, useState } from "react";
import "./EvaluationPage.css";
import { useEvaluationMetrics } from "../hooks/openAiHooks";
import { useMessages } from "../hooks/useMessages";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const EvaluationPage = () => {
  const { mutateAsync: getEvaluationAsync } = useEvaluationMetrics();
  const { messages } = useMessages();
  const [evaluations, setEvaluations] = useState([]);
  // const [evaluations, setEvaluations] = useState([
  //   {
  //     categoryID: "1",
  //     categoryName: "Establishing a connection & Reassuring the victim",
  //     reason:
  //       "The agent introduced themselves and consistently reassured the victim throughout the call that help was on the way and they would stay with them. This created a supportive and calming environment for the victim.",
  //     score: 10,
  //   },
  //   {
  //     categoryID: "2",
  //     categoryName: "Gathering information on injuries",
  //     reason:
  //       "The agent asked clear and direct questions about the victim's injuries, including follow-up questions about bleeding, bruises, and other pain. They effectively gathered relevant information about the victim's physical state.",
  //     score: 9,
  //   },
  //   {
  //     categoryID: "3",
  //     categoryName:
  //       "Gathering information on the accident scene (cause of accident, other vehicles/persons involved)",
  //     reason:
  //       "The agent successfully inquired about the cause of the accident and if other vehicles or persons were involved. The questions were relevant and aimed at understanding the immediate accident context.",
  //     score: 9,
  //   },
  //   {
  //     categoryID: "4",
  //     categoryName:
  //       "Gathering information on the vehicle's condition (position, smoke, leaking liquids)",
  //     reason:
  //       "The agent systematically asked about the vehicle's position, the presence of smoke, and any leaking liquids. This allowed for a comprehensive assessment of potential hazards related to the vehicle.",
  //     score: 9,
  //   },
  //   {
  //     categoryID: "5",
  //     categoryName:
  //       "Gathering information on the road conditions (blockage, other hazards)",
  //     reason:
  //       "The agent specifically inquired about the road being clear or blocked, which is a crucial aspect of road conditions. However, they could have probed further for other potential hazards beyond just blockage.",
  //     score: 8,
  //   },
  //   {
  //     categoryID: "6",
  //     categoryName: "Collecting personal details (name, phone number)",
  //     reason:
  //       "The agent politely requested the victim's name and phone number, clearly stating the reason for needing the information for rescue teams. This was handled professionally and discreetly.",
  //     score: 10,
  //   },
  // ]);

  useEffect(() => {
    // Don't fire until we actually have some messages
    if (!messages.length) return;

    const fetchEvaluations = async () => {
      try {
        const payload = messages
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");

        const result = await getEvaluationAsync(payload);
        setEvaluations(result.data.output ?? []); 
      } catch (err) {
        console.error("Evaluation request failed:", err);
      }
    };

    fetchEvaluations();
  }, [messages, getEvaluationAsync]);

  const getTopAndBottom3 = (data) => {
    const sorted = [...data].sort((a, b) => b.score - a.score);
    return {
      top3: sorted.slice(0, 3),
      bottom3: sorted.slice(-3).reverse(),
    };
  };

  const handleCalculateTotalScore = (evaluations) => {
    return evaluations.reduce((sum, curr) => sum + curr.score, 0);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 5) return "orange";
    return "red";
  };

  return (
    <div className="app-evaluation-container">
      <div className="app-evaluation-content">
        <div className="page-title">Evaluation Dashboard</div>
        <div className="dashboard-content">
          <div className="description-score-layout">
            <div className="evaluation-description"></div>
            <div className="evaluation-score">
              Score <span>{handleCalculateTotalScore(evaluations)}/60</span>
            </div>
          </div>
          <div className="metrics">
            {evaluations.length > 0 && (
              <div className="metrics-tables">
                <div className="metrics-table">
                  {/* <Typography variant="h6" sx={{ mt: 2, mb: 1, fontFamily: 'Bosch Sans' }}>
                    Top 3 Categories You Did Well
                  </Typography> */}
                  <TableContainer component={Paper} sx={{ mb: 4 }}>
                    <Table
                      size="medium"
                      sx={{ fontFamily: "Bosch Sans, sans-serif" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className="table-header" sx={{width: '10%'}}>
                            Category ID
                          </TableCell>
                          <TableCell className="table-header">
                            Category
                          </TableCell>
                          <TableCell className="table-header">Score</TableCell>
                          <TableCell className="table-header">Reason</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[...evaluations].sort((a,b) => b.score - a.score).map((row, index) => (
                          <TableRow key={row.categoryID} sx={{background: index % 2 === 0 ? 'transparent' : 'lightgray' }}>
                            <TableCell className="table-row">
                              {row.categoryID}
                            </TableCell>
                            <TableCell className="table-row">
                              {row.categoryName}
                            </TableCell>
                            <TableCell
                              className="table-row"
                              sx={{
                                color: getScoreColor(row.score),
                                fontWeight: 600,
                                transition: "color 0.2s ease-in-out"
                              }}
                            >
                              {row.score}
                            </TableCell>
                            <TableCell className="table-row">
                              {row.reason}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
