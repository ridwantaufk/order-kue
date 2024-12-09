import QRCode from 'qrcode';

export const openPrintWindow = (
  paymentInfo,
  handleCopyOrderID,
  handleCopyVANumber,
  handleCopyAmount,
) => {
  const printWindow = window.open('', '', 'width=800,height=600');

  // Menghasilkan QR Code dalam bentuk data URL menggunakan library `qrcode`
  QRCode.toDataURL(paymentInfo.vaNumber, { errorCorrectionLevel: 'H' })
    .then((qrCodeImageUrl) => {
      // Menulis konten untuk halaman yang akan dicetak
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Pembayaran</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 0;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              h1 {
                text-align: center;
                font-size: 24px;
                margin-bottom: 20px;
                color: #007BFF;
              }
              h2 {
                font-size: 16px;
                margin-bottom: 5px;
              }
              p {
                font-size: 14px;
                margin: 0 0 10px;
              }
              .row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
              }
              .label {
                font-weight: bold;
              }
              .qr-code {
                text-align: center;
                margin-top: 20px;
              }
              .qr-code img {
                width: 250px;
                height: 250px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Informasi Pembayaran</h1>
              <div class="row">
                <div class="label">Order ID:</div>
                <div>${paymentInfo.orderID}</div>
              </div>
              <div class="row">
                <div class="label">VA Number:</div>
                <div>${paymentInfo.vaNumber}</div>
              </div>
              <div class="row">
                <div class="label">Jumlah:</div>
                <div>Rp${paymentInfo.amount.toLocaleString('id-ID')}</div>
              </div>

              <!-- QR Code -->
              <div class="qr-code">
                <img src="${qrCodeImageUrl}" alt="QR Code" />
              </div>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    })
    .catch((err) => {
      console.error('Error generating QR code:', err);
    });
};
