
export const getReports = async (req, res) => {
    try {
      const reports = await prisma.report.findMany({
        include: {
          reporter: { select: { username: true } },
          suspect: { select: { username: true } },
        },
      });
      res.status(200).json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch reports!" });
    }
  };