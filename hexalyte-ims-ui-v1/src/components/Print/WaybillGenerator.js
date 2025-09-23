import jsPDF from "jspdf";
import { generateBarcode, generateBarcodeByType } from "../../utils/barcode";

// QR Code generation function (placeholder - implement with actual QR library)
const generateQRCode = (data, size = 100) => {
  try {
    // Create a simple QR placeholder for now
    // In production, use a proper QR code library like qrcode
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // Simple pattern placeholder
    ctx.fillStyle = '#000000';
    for (let i = 0; i < size; i += 4) {
      for (let j = 0; j < size; j += 4) {
        if ((i + j) % 8 === 0) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.warn('QR Code generation failed:', error);
    return null;
  }
};


export const generateWaybill = (
  assignedOrders,
  partnerData,
  orders,
  calculateOrderTotal,
  priority = "normal",
  notes = "",
  options = {}
) => {



  // Validation
  if (!assignedOrders?.length) {
    throw new Error('No orders assigned for waybill generation');
  }
  if (!partnerData?.DeliveryPartnerName) {
    throw new Error('Partner data is required');
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Exact SPX-style Shipping Label Configuration
  const config = {
    labelWidth: 105,  // Standard shipping label width
    labelHeight: 75,  // Standard shipping label height  
    marginX: 3,
    marginY: 3,
    startX: 3,
    startY: 3,
    labelsPerRow: 2,
    labelsPerColumn: 2,
    borderWidth: 1.2,  // Thick border like reference
    cornerRadius: 0,   // Sharp corners like reference
    colors: {
      primary: '#0f172a',        // Deep slate
      secondary: '#1e293b',      // Slate 800
      accent: '#0ea5e9',         // Sky 500
      success: '#10b981',        // Emerald 500
      warning: '#f59e0b',        // Amber 500
      danger: '#ef4444',         // Red 500
      text: '#1f2937',           // Gray 800
      textLight: '#6b7280',      // Gray 500
      lightGray: '#f8fafc',      // Slate 50
      border: '#e2e8f0',         // Slate 200
      headerBg: '#0f172a',       // Deep slate background
      cardBg: '#ffffff',         // Pure white
      accentBg: '#e0f2fe'        // Light sky blue
    },
    fonts: {
      brand: { size: 12, weight: 'bold' },
      header: { size: 10, weight: 'bold' },
      subheader: { size: 9, weight: 'bold' },
      body: { size: 8, weight: 'normal' },
      small: { size: 7, weight: 'normal' },
      tiny: { size: 6, weight: 'normal' },
      micro: { size: 5, weight: 'normal' }
    },
    ...options
  };

  const { labelWidth, labelHeight, marginX, marginY, startX, startY } = config;
  const { labelsPerRow, labelsPerColumn } = config;
  const labelsPerPage = labelsPerRow * labelsPerColumn;

  let labelCount = 0;
  let pageCount = 1;

  // Helper functions
  const setFont = (fontConfig) => {
    doc.setFontSize(fontConfig.size).setFont(undefined, fontConfig.weight);
  };

  const drawRoundedRect = (x, y, width, height, radius = 2) => {
    doc.roundedRect(x, y, width, height, radius, radius);
  };

  const drawDottedLine = (x1, y1, x2, y2) => {
    doc.setLineDashPattern([1, 1], 0);
    doc.line(x1, y1, x2, y2);
    doc.setLineDashPattern([], 0);
  };

  const safeText = (text, x, y, maxWidth, alignment = 'left') => {
    if (!text) return [];
    const wrappedText = doc.splitTextToSize(String(text), maxWidth);
    doc.text(wrappedText, x, y, { align: alignment });
    return wrappedText;
  };

  const drawPriorityBadge = (x, y, priority) => {
    const badgeWidth = 28;
    const badgeHeight = 8;
    
    // Enhanced color scheme based on priority
    let fillColor, textColor = [255, 255, 255];
    switch (priority.toLowerCase()) {
      case 'urgent': 
        fillColor = [239, 68, 68];  // Red 500
        break;
      case 'high': 
        fillColor = [245, 158, 11]; // Amber 500
        break;
      default: 
        fillColor = [16, 185, 129]; // Emerald 500
        break;
    }
    
    // Draw shadow
    doc.setFillColor(0, 0, 0, 0.1);
    drawRoundedRect(x + 0.5, y + 0.5, badgeWidth, badgeHeight, 4);
    doc.fill();
    
    // Draw main badge
    doc.setFillColor(...fillColor);
    drawRoundedRect(x, y, badgeWidth, badgeHeight, 4);
    doc.fill();
    
    // Add text
    doc.setTextColor(...textColor);
    setFont(config.fonts.tiny);
    doc.text(priority.toUpperCase(), x + badgeWidth/2, y + 5.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  };

  // Modern page header
  const addPageHeader = () => {
    // Header background
    doc.setFillColor(15, 23, 42); // Deep slate
    drawRoundedRect(8, 3, 194, 12, 3);
    doc.fill();
    
    // Main title
    setFont(config.fonts.brand);
    doc.setTextColor(255, 255, 255);
    doc.text(`${partnerData.DeliveryPartnerName.toUpperCase()} - DELIVERY WAYBILL`, 105, 8, { align: 'center' });
    
    // Subtitle with modern styling
    setFont(config.fonts.small);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 10, 12);
    doc.text(`Page ${pageCount}`, 200, 12, { align: 'right' });
    
    // Modern accent line
    doc.setDrawColor(14, 165, 233); // Sky 500
    doc.setLineWidth(1);
    doc.line(10, 17, 200, 17);
    doc.setDrawColor(0, 0, 0);
    doc.setTextColor(0, 0, 0);
  };


  // Process each order
  assignedOrders.forEach((assignment, index) => {
    const order = orders.find(o => o.NewOrderID === assignment.orderId);
    if (!order) {
      console.warn(`Order ${assignment.orderId} not found, skipping...`);
      return;
    }

    const positionInPage = labelCount % labelsPerPage;
    const row = Math.floor(positionInPage / labelsPerRow);
    const col = positionInPage % labelsPerRow;

    const labelX = startX + col * (labelWidth + marginX);
    const labelY = startY + 20 + row * (labelHeight + marginY);

    // Add new page if needed
    if (labelCount > 0 && positionInPage === 0) {
      doc.addPage();
      pageCount++;
    }

    // Add header to each page
    if (positionInPage === 0) {
      addPageHeader();
    }


    // === EXACT SPX-STYLE SHIPPING LABEL ===
    // Main thick border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(config.borderWidth);
    doc.rect(labelX, labelY, labelWidth, labelHeight);

    let currentY = labelY + 4;

    // 1. TOP HEADER SECTION (exactly like reference)
    // Service codes box (top right)
    doc.setLineWidth(0.5);
    doc.rect(labelX + labelWidth - 35, labelY + 1, 34, 12);
    
    setFont(config.fonts.tiny);
    doc.setTextColor(0, 0, 0);
    doc.text("C-123-SCI-LAC-311", labelX + labelWidth - 33, labelY + 4);
    doc.text("C-10-JPM-1.8-DH", labelX + labelWidth - 33, labelY + 7);
    doc.text("RTS Soft Code:", labelX + labelWidth - 33, labelY + 10);
    doc.text("RTS-A-820-WCO-EUQ-220", labelX + labelWidth - 33, labelY + 13);

    // Company logo (left side - large and prominent)
    setFont({ size: 16, weight: 'bold' });
    doc.setTextColor(255, 0, 0); // SPX red
    doc.text("SPX", labelX + 3, labelY + 8);
    
    // Horizontal divider line
    doc.setLineWidth(0.8);
    doc.line(labelX, labelY + 14, labelX + labelWidth, labelY + 14);

    currentY = labelY + 17;

    // 2. ORDER ID AND BARCODE SECTION (exactly like reference)
    setFont(config.fonts.body);
    doc.setTextColor(0, 0, 0);
    doc.text(`Order ID: ${order.NewOrderID}12KBFANR`, labelX + 3, currentY);
    currentY += 5;

    // Main barcode (large and prominent like reference)
    try {
      const barcodeData = assignment.trackingNumber || `${order.NewOrderID}12KBFANR`;
      const trackingBarcode = generateBarcode(barcodeData, { 
        width: 2.5, 
        height: 50,
        displayValue: false 
      });
      
      const barcodeWidth = 98;
      const barcodeX = labelX + 3;
      
      doc.addImage(trackingBarcode, "PNG", barcodeX, currentY, barcodeWidth, 15);
      
      // Tracking number below barcode (exactly positioned like reference)
      setFont(config.fonts.body);
      doc.setTextColor(0, 0, 0);
      doc.text(barcodeData, labelX + labelWidth/2, currentY + 18, { align: "center" });
      currentY += 22;
      
    } catch (error) {
      console.warn('Barcode generation failed:', error);
      setFont(config.fonts.body);
      doc.text(`${assignment.trackingNumber || order.NewOrderID}12KBFANR`, labelX + labelWidth/2, currentY + 8, { align: "center" });
      currentY += 15;
    }

    // Horizontal divider
    doc.setLineWidth(0.5);
    doc.line(labelX, currentY, labelX + labelWidth, currentY);
    currentY += 3;

    // 3. RECIPIENT TABLE (exactly like reference layout)
    // Create table structure with borders like reference
    const tableStartY = currentY;
    const rowHeight = 6;
    
    // Left column (FROM/TO labels)
    doc.setLineWidth(0.5);
    doc.rect(labelX, tableStartY, 15, rowHeight * 2);
    
    setFont(config.fonts.tiny);
    doc.setTextColor(0, 0, 0);
    doc.text("FROM", labelX + 2, tableStartY + 3);
    doc.text("TO", labelX + 2, tableStartY + 9);
    
    // Right column (Address details)
    doc.rect(labelX + 15, tableStartY, labelWidth - 15, rowHeight * 2);
    
    // FROM address (company details)
    setFont(config.fonts.micro);
    doc.text(`${partnerData.DeliveryPartnerName}`, labelX + 17, tableStartY + 2);
    doc.text("32 GBIB Avenue Bldg, Sangandaan,", labelX + 17, tableStartY + 4);
    doc.text("Project 8, Quezon City", labelX + 17, tableStartY + 6);
    
    // TO address (customer details)
    doc.text(`${order.CustomerName}`, labelX + 17, tableStartY + 8);
    const address = [order.Address, order.CityName].filter(Boolean).join(', ');
    const addressLines = doc.splitTextToSize(address, 80);
    let addressY = tableStartY + 10;
    addressLines.slice(0, 2).forEach(line => {
      doc.text(line, labelX + 17, addressY);
      addressY += 2;
    });
    
    currentY = tableStartY + 14;

    // 3. MAIN BARCODE SECTION (like reference design)
    try {
      const barcodeData = assignment.trackingNumber || `${order.NewOrderID}KBFANR`;
      const trackingBarcode = generateBarcode(barcodeData, { 
        width: 2, 
        height: 40,
        displayValue: false 
      });
      
      const barcodeWidth = 85;
      const barcodeX = labelX + (labelWidth - barcodeWidth) / 2;
      
      // Add main barcode (prominent like reference)
      doc.addImage(trackingBarcode, "PNG", barcodeX, currentY, barcodeWidth, 12);
      
      // Tracking number below barcode (large, clear)
      setFont(config.fonts.body);
      doc.setTextColor(0, 0, 0);
      doc.text(barcodeData, labelX + labelWidth / 2, currentY + 15, { align: "center" });
      currentY += 18;
      
    } catch (error) {
      console.warn('Barcode generation failed:', error);
      setFont(config.fonts.body);
      doc.setTextColor(0, 0, 0);
      doc.text(`Tracking: ${assignment.trackingNumber || order.NewOrderID}`, labelX + labelWidth / 2, currentY + 6, { align: "center" });
      currentY += 12;
    }

    // 4. DELIVERY ATTEMPT TRACKING (like reference)
    const remainingSpace = (labelY + labelHeight - 15) - currentY;
    if (remainingSpace > 12) {
      // Section header
      setFont(config.fonts.small);
      doc.setTextColor(0, 0, 0);
      doc.text("Delivery Attempt:", labelX + 3, currentY + 3);
      
      // Draw attempt boxes (like reference grid)
      const boxSize = 6;
      const boxSpacing = 8;
      const startBoxX = labelX + 35;
      
      for (let i = 1; i <= 3; i++) {
        const boxX = startBoxX + (i - 1) * boxSpacing;
        
        // Draw box
        doc.setLineWidth(0.3);
        doc.rect(boxX, currentY, boxSize, boxSize);
        
        // Add number below box
        setFont(config.fonts.tiny);
        doc.text(i.toString(), boxX + boxSize/2, currentY + boxSize + 3, { align: 'center' });
      }
      
      currentY += 12;
      
      // Product details section (simplified)
      setFont(config.fonts.tiny);
      doc.text(`Product: ${order.CustomerName}`, labelX + 3, currentY);
      currentY += 4;
      doc.text(`Destination: ${order.CityName}`, labelX + 3, currentY);
      currentY += 4;
      
      try {
        const orderTotal = calculateOrderTotal(order);
        doc.text(`Value: Rs. ${orderTotal}`, labelX + 3, currentY);
      } catch (error) {
        doc.text("Value: N/A", labelX + 3, currentY);
      }
      currentY += 6;
    }

    // 5. NOTES SECTION (if available and space permits)
    if (notes?.trim() && currentY < labelY + labelHeight - 8) {
      setFont(config.fonts.micro);
      doc.setTextColor(100, 100, 100);
      const wrappedNotes = safeText(notes, labelX + 3, currentY, labelWidth - 6);
      currentY += Math.min(wrappedNotes.length * 2, 8);
    }

    // 6. FOOTER WITH QR CODE (like reference design)
    const footerY = labelY + labelHeight - 10;
    
    // QR Code section (bottom left like reference)
    try {
      const qrData = `${assignment.trackingNumber || order.NewOrderID}-${partnerData.DeliveryPartnerName}`;
      const qrCode = generateQRCode(qrData, 80);
      if (qrCode) {
        // QR code positioning like reference
        doc.addImage(qrCode, "PNG", labelX + 3, footerY, 12, 12);
        
        // QR label
        setFont(config.fonts.micro);
        doc.setTextColor(0, 0, 0);
        doc.text("SCAN", labelX + 9, footerY + 14, { align: 'center' });
      }
    } catch (error) {
      // Fallback QR placeholder
      doc.setLineWidth(0.3);
      doc.rect(labelX + 3, footerY, 12, 12);
      setFont(config.fonts.micro);
      doc.text("QR", labelX + 9, footerY + 7, { align: 'center' });
    }
    
    // Footer text (right side)
    setFont(config.fonts.micro);
    doc.setTextColor(0, 0, 0);
    
    // Company footer text (like reference)
    doc.text("HEXALYTE LOGISTICS", labelX + 20, footerY + 3);
    doc.text("www.hexalyte.com", labelX + 20, footerY + 6);
    
    // Label info (top right)
    doc.text(`Label ${index + 1}/${assignedOrders.length}`, labelX + labelWidth - 3, footerY + 3, { align: 'right' });
    doc.text(new Date().toLocaleDateString(), labelX + labelWidth - 3, footerY + 6, { align: 'right' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);

    labelCount++;
  });

  // Add summary page if more than 10 orders
  if (assignedOrders.length > 10) {
    doc.addPage();
    pageCount++;
    
    // Summary page content
    setFont(config.fonts.header);
    doc.text("Waybill Summary", 105, 30, { align: 'center' });
    
    setFont(config.fonts.body);
    let summaryY = 50;
    
    doc.text(`Total Orders: ${assignedOrders.length}`, 20, summaryY);
    summaryY += 8;
    doc.text(`Partner: ${partnerData.DeliveryPartnerName}`, 20, summaryY);
    summaryY += 8;
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, summaryY);
    summaryY += 8;
    doc.text(`Priority Level: ${priority.toUpperCase()}`, 20, summaryY);
    
    if (notes) {
      summaryY += 15;
      setFont(config.fonts.subheader);
      doc.text("Batch Notes:", 20, summaryY);
      summaryY += 6;
      setFont(config.fonts.body);
      const summaryNotes = doc.splitTextToSize(notes, 160);
      doc.text(summaryNotes, 20, summaryY);
    }
  }

  // Generate and save PDF
  const timestamp = new Date().toISOString().split("T")[0];
  const sanitizedPartnerName = partnerData.DeliveryPartnerName
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 20);
  
  const fileName = `waybill_${sanitizedPartnerName}_${timestamp}_${assignedOrders.length}orders.pdf`;
  
  try {
    doc.save(fileName);
    console.log(`Waybill generated successfully: ${fileName}`);
    return { success: true, fileName, orderCount: assignedOrders.length };
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw new Error('Failed to save waybill PDF');
  }
};

// Export additional utility function for preview
export const generateWaybillPreview = (assignedOrders, partnerData, orders, calculateOrderTotal) => {
  return {
    totalOrders: assignedOrders.length,
    totalPages: Math.ceil(assignedOrders.length / 10),
    partnerName: partnerData.DeliveryPartnerName,
    estimatedSize: `${(assignedOrders.length * 0.1).toFixed(1)} MB`,
    orders: assignedOrders.slice(0, 5).map(assignment => {
      const order = orders.find(o => o.NewOrderID === assignment.orderId);
      return order ? {
        orderId: order.NewOrderID,
        customer: order.CustomerName,
        city: order.CityName,
        trackingNumber: assignment.trackingNumber
      } : null;
    }).filter(Boolean)
  };
};