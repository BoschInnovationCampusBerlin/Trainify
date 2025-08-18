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
  Box,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

const EvaluationPage = () => {
  const {
    mutateAsync: getEvaluationAsync,
    isPending: isLoading,
    isError,
  } = useEvaluationMetrics();
  const { messages } = useMessages();
  const [evaluations, setEvaluations] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
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
        setErrorMessage(
          "Evaluation Metrics cannot be processed at the moment. Please try again later."
        );
      }
    };

    fetchEvaluations();
  }, [messages]);

  const handleCalculateTotalScore = (evaluations) => {
    return evaluations.reduce((sum, curr) => sum + curr.score, 0);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 5) return "orange";
    return "red";
  };

  const getPercentageColor = (percentage) => {
    console.log(percentage);
    if (percentage >= 80) return "green";
    if (percentage >= 50) return "orange";
    return "red";
  };

  return (
    <div className="app-evaluation-container">
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Snackbar
        open={!!isError}
      >
        <Alert
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {!isLoading && (!errorMessage || !isError) && (
        <div className="app-evaluation-content">
          <div className="page-title">Evaluation Dashboard</div>
          <div className="dashboard-content">
            <div className="description-score-layout">
              <div className="evaluation-description"></div>
              <div className="evaluation-score">
                Score <span>{handleCalculateTotalScore(evaluations)}/60</span>
                {evaluations.length > 0 && (
                  <div className="evaluation-score">
                    <Box
                      component="span"
                      sx={{
                        color: getPercentageColor(
                          (handleCalculateTotalScore(evaluations) / 60) * 100
                        ),
                      }}
                    >
                      {(
                        (handleCalculateTotalScore(evaluations) / 60) *
                        100
                      ).toFixed(2)}
                      %
                    </Box>
                  </div>
                )}
              </div>
            </div>
            <div className="metrics">
              {evaluations.length > 0 && (
                <div className="metrics-tables">
                  <div className="metrics-table">
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                      <Table
                        size="medium"
                        sx={{ fontFamily: "Bosch Sans, sans-serif" }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className="table-header"
                              sx={{ width: "10%" }}
                            >
                              Category ID
                            </TableCell>
                            <TableCell className="table-header">
                              Category
                            </TableCell>
                            <TableCell className="table-header">
                              Score
                            </TableCell>
                            <TableCell className="table-header">
                              Reason
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[...evaluations]
                            .sort((a, b) => b.score - a.score)
                            .map((row, index) => (
                              <TableRow
                                key={row.categoryID}
                                sx={{
                                  background:
                                    index % 2 === 0
                                      ? "transparent"
                                      : "lightgray",
                                }}
                              >
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
                                    transition: "color 0.2s ease-in-out",
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
      )}
    </div>
  );
};

export default EvaluationPage;
