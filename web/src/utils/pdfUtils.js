import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateReportPDF = async (report, imageUrl) => {
  // Create a new jsPDF instance
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  
  // Add header with logo placeholder
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // #2563eb - primary color
  pdf.text('SafeStreets', margin, margin + 7);
  pdf.setFontSize(16);
  pdf.setTextColor(100, 116, 139); // #64748b - secondary color
  pdf.text('Damage Report', margin, margin + 15);
  
  // Add horizontal line
  pdf.setDrawColor(226, 232, 240); // #e2e8f0 - border color
  pdf.line(margin, margin + 20, pageWidth - margin, margin + 20);
  
  // Add report ID and date
  pdf.setFontSize(12);
  pdf.setTextColor(30, 41, 59); // #1e293b - text primary color
  pdf.text(`Report ID: ${report.reportId || report._id || 'N/A'}`, margin, margin + 30);
  pdf.text(`Date: ${new Date(report.createdAt).toLocaleString()}`, margin, margin + 38);
  
  // Add report details
  let yPos = margin + 48;
  const lineHeight = 8;
  
  // Helper to add a field with label and value
  const addField = (label, value, y) => {
    pdf.setFontSize(11);
    pdf.setTextColor(100, 116, 139); // #64748b - secondary text color
    pdf.text(`${label}:`, margin, y);
    pdf.setTextColor(30, 41, 59); // #1e293b - primary text color
    pdf.text(value || 'N/A', margin + 30, y);
    return y + lineHeight;
  };
  
  // Add fields
  yPos = addField('Region', report.region, yPos);
  yPos = addField('Location', report.location, yPos);
  yPos = addField('Damage Type', report.damageType, yPos);
  yPos = addField('Severity', report.severity, yPos);
  yPos = addField('Priority', report.priority, yPos);
  yPos = addField('Status', report.status, yPos);
  
  // Add description title
  yPos += 5;
  pdf.setFontSize(12);
  pdf.setTextColor(30, 41, 59); // #1e293b - text primary color
  pdf.text('Description', margin, yPos);
  yPos += 7;
  
  // Add description text with word wrapping
  if (report.description) {
    pdf.setFontSize(10);
    pdf.setTextColor(30, 41, 59); // #1e293b - primary text color
    
    const splitText = pdf.splitTextToSize(report.description, pageWidth - margin * 2);
    pdf.text(splitText, margin, yPos);
    yPos += splitText.length * 6 + 5;
  } else {
    yPos += 8;
  }
  
  // Add image if available
  if (imageUrl) {
    try {
      // Load the image
      const img = new Image();
      img.crossOrigin = "Anonymous";  // This is important for canvas to work with cross-origin images
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      // Calculate image dimensions to fit the PDF
      const maxImgWidth = pageWidth - margin * 2;
      const maxImgHeight = 80;  // Limit image height
      
      let imgWidth = img.width;
      let imgHeight = img.height;
      
      if (imgWidth > maxImgWidth) {
        const ratio = maxImgWidth / imgWidth;
        imgWidth = maxImgWidth;
        imgHeight = imgHeight * ratio;
      }
      
      if (imgHeight > maxImgHeight) {
        const ratio = maxImgHeight / imgHeight;
        imgHeight = maxImgHeight;
        imgWidth = imgWidth * ratio;
      }
      
      // Add image title
      pdf.setFontSize(12);
      pdf.setTextColor(30, 41, 59); // #1e293b - text primary color
      pdf.text('Damage Image', margin, yPos);
      yPos += 7;
      
      // Check if we need a new page for the image
      if (yPos + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = margin + 10;
      }
      
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Get the image data URL and add to PDF
      const imgData = canvas.toDataURL('image/jpeg');
      pdf.addImage(imgData, 'JPEG', margin, yPos, imgWidth, imgHeight);
      
      yPos += imgHeight + 10;
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      // Add a note about image error
      pdf.setTextColor(220, 38, 38); // #dc2626 - error color
      pdf.text('(Error loading image)', margin, yPos);
      yPos += 10;
    }
  }
  
  // Add footer
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139); // #64748b - secondary color
  pdf.text(`Generated on ${new Date().toLocaleString()}`, margin, pageHeight - margin);
  pdf.text('SafeStreets - Damage Report Management System', pageWidth - margin - 75, pageHeight - margin);
  
  // Save the PDF
  pdf.save(`damage-report-${report.reportId || report._id || new Date().getTime()}.pdf`);
};

export const generateReportPDFFromElement = async (reportElement, report) => {
  if (!reportElement) {
    console.error('Report element not provided');
    return;
  }
  
  try {
    // Capture the element as an image
    const canvas = await html2canvas(reportElement, {
      scale: 2, // Higher resolution
      logging: false,
      useCORS: true, // Allow images from other domains
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    
    // Calculate image width and height to fit page
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add title
    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235); // #2563eb - primary color
    pdf.text('SafeStreets Damage Report', margin, margin + 7);
    
    let currentY = margin + 15;
    
    // If the image is very tall, we might need multiple pages
    if (imgHeight > pageHeight - 40) {
      // Add the image scaled to fit the page width
      pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
    } else {
      // Add the image centered in the page
      pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
    }
    
    // Add footer
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139); // #64748b - secondary color
    pdf.text(`Generated on ${new Date().toLocaleString()}`, margin, pageHeight - 5);
    
    // Save PDF
    pdf.save(`damage-report-${report.reportId || report._id || new Date().getTime()}.pdf`);
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    alert('Error generating PDF. Please try again.');
  }
};
