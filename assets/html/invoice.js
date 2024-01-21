const moment = require("moment");
const { formatRupiah } = require("../../helpers/formatRupiah");

exports.invoice = (data) => {
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Gendut Grosir</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>
        body,
        html {
          margin: 0;
          padding: 0;
        }
  
        * {
          text-transform: none !important;
          font-family: "Montserrat", sans-serif !important;
          color: #101828;
  
          box-sizing: border-box;
        }
        .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 100px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 25px;
          padding-left: 25px;
          background: #f9f5ff;
        }
        .border {
          border: 1px solid red;
        }
        .column {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .column-left {
          display: flex;
          flex-direction: column;
        }
        .column-2 {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          margin: 20px 25px;
        }
        .text-14 {
          font-size: 14px;
          font-weight: 500;
        }
        .text-18 {
          font-size: 18px;
          font-weight: 600;
        }
        .right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        ul {
          list-style-type: none;
          margin: 0;
          margin-top: 10px;
          padding: 0;
        }
  
        td {
          /* border: 1px solid; */
          padding: 15px 27px;
        }
        td:last-child {
          display: flex;
          justify-content: end;
        }
  
        table {
          width: 100%;
          /* border-collapse: collapse; */
        }
        th {
          padding-bottom: 25px;
        }
        .t-right table {
          font-weight: 600;
        }
        .t-right td {
          background: unset;
          border-bottom: unset;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <svg
            width="204"
            height="90"
            viewBox="0 0 204 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M67.12 44.78H70.08V50.46C69.32 51.0333 68.44 51.4733 67.44 51.78C66.44 52.0867 65.4333 52.24 64.42 52.24C62.9667 52.24 61.66 51.9333 60.5 51.32C59.34 50.6933 58.4267 49.8333 57.76 48.74C57.1067 47.6333 56.78 46.3867 56.78 45C56.78 43.6133 57.1067 42.3733 57.76 41.28C58.4267 40.1733 59.3467 39.3133 60.52 38.7C61.6933 38.0733 63.0133 37.76 64.48 37.76C65.7067 37.76 66.82 37.9667 67.82 38.38C68.82 38.7933 69.66 39.3933 70.34 40.18L68.26 42.1C67.26 41.0467 66.0533 40.52 64.64 40.52C63.7467 40.52 62.9533 40.7067 62.26 41.08C61.5667 41.4533 61.0267 41.98 60.64 42.66C60.2533 43.34 60.06 44.12 60.06 45C60.06 45.8667 60.2533 46.64 60.64 47.32C61.0267 48 61.56 48.5333 62.24 48.92C62.9333 49.2933 63.72 49.48 64.6 49.48C65.5333 49.48 66.3733 49.28 67.12 48.88V44.78ZM83.0097 46.66C83.0097 46.7 82.9897 46.98 82.9497 47.5H74.8097C74.9564 48.1667 75.303 48.6933 75.8497 49.08C76.3964 49.4667 77.0764 49.66 77.8897 49.66C78.4497 49.66 78.943 49.58 79.3697 49.42C79.8097 49.2467 80.2164 48.98 80.5897 48.62L82.2497 50.42C81.2364 51.58 79.7564 52.16 77.8097 52.16C76.5964 52.16 75.523 51.9267 74.5897 51.46C73.6564 50.98 72.9364 50.32 72.4297 49.48C71.923 48.64 71.6697 47.6867 71.6697 46.62C71.6697 45.5667 71.9164 44.62 72.4097 43.78C72.9164 42.9267 73.603 42.2667 74.4697 41.8C75.3497 41.32 76.3297 41.08 77.4097 41.08C78.463 41.08 79.4164 41.3067 80.2697 41.76C81.123 42.2133 81.7897 42.8667 82.2697 43.72C82.763 44.56 83.0097 45.54 83.0097 46.66ZM77.4297 43.44C76.723 43.44 76.1297 43.64 75.6497 44.04C75.1697 44.44 74.8764 44.9867 74.7697 45.68H80.0697C79.963 45 79.6697 44.46 79.1897 44.06C78.7097 43.6467 78.123 43.44 77.4297 43.44ZM91.2269 41.08C92.5602 41.08 93.6335 41.48 94.4469 42.28C95.2735 43.08 95.6869 44.2667 95.6869 45.84V52H92.5669V46.32C92.5669 45.4667 92.3802 44.8333 92.0069 44.42C91.6335 43.9933 91.0935 43.78 90.3869 43.78C89.6002 43.78 88.9735 44.0267 88.5069 44.52C88.0402 45 87.8069 45.72 87.8069 46.68V52H84.6869V41.24H87.6669V42.5C88.0802 42.0467 88.5935 41.7 89.2069 41.46C89.8202 41.2067 90.4935 41.08 91.2269 41.08ZM109.192 37.16V52H106.212V50.76C105.439 51.6933 104.319 52.16 102.852 52.16C101.839 52.16 100.919 51.9333 100.092 51.48C99.2789 51.0267 98.6389 50.38 98.1722 49.54C97.7055 48.7 97.4722 47.7267 97.4722 46.62C97.4722 45.5133 97.7055 44.54 98.1722 43.7C98.6389 42.86 99.2789 42.2133 100.092 41.76C100.919 41.3067 101.839 41.08 102.852 41.08C104.226 41.08 105.299 41.5133 106.072 42.38V37.16H109.192ZM103.392 49.6C104.179 49.6 104.832 49.3333 105.352 48.8C105.872 48.2533 106.132 47.5267 106.132 46.62C106.132 45.7133 105.872 44.9933 105.352 44.46C104.832 43.9133 104.179 43.64 103.392 43.64C102.592 43.64 101.932 43.9133 101.412 44.46C100.892 44.9933 100.632 45.7133 100.632 46.62C100.632 47.5267 100.892 48.2533 101.412 48.8C101.932 49.3333 102.592 49.6 103.392 49.6ZM122.52 41.24V52H119.56V50.72C119.147 51.1867 118.653 51.5467 118.08 51.8C117.507 52.04 116.887 52.16 116.22 52.16C114.807 52.16 113.687 51.7533 112.86 50.94C112.033 50.1267 111.62 48.92 111.62 47.32V41.24H114.74V46.86C114.74 48.5933 115.467 49.46 116.92 49.46C117.667 49.46 118.267 49.22 118.72 48.74C119.173 48.2467 119.4 47.52 119.4 46.56V41.24H122.52ZM131.95 51.48C131.644 51.7067 131.264 51.88 130.81 52C130.37 52.1067 129.904 52.16 129.41 52.16C128.13 52.16 127.137 51.8333 126.43 51.18C125.737 50.5267 125.39 49.5667 125.39 48.3V43.88H123.73V41.48H125.39V38.86H128.51V41.48H131.19V43.88H128.51V48.26C128.51 48.7133 128.624 49.0667 128.85 49.32C129.09 49.56 129.424 49.68 129.85 49.68C130.344 49.68 130.764 49.5467 131.11 49.28L131.95 51.48ZM148.246 44.78H151.206V50.46C150.446 51.0333 149.566 51.4733 148.566 51.78C147.566 52.0867 146.559 52.24 145.546 52.24C144.092 52.24 142.786 51.9333 141.626 51.32C140.466 50.6933 139.552 49.8333 138.886 48.74C138.232 47.6333 137.906 46.3867 137.906 45C137.906 43.6133 138.232 42.3733 138.886 41.28C139.552 40.1733 140.472 39.3133 141.646 38.7C142.819 38.0733 144.139 37.76 145.606 37.76C146.832 37.76 147.946 37.9667 148.946 38.38C149.946 38.7933 150.786 39.3933 151.466 40.18L149.386 42.1C148.386 41.0467 147.179 40.52 145.766 40.52C144.872 40.52 144.079 40.7067 143.386 41.08C142.692 41.4533 142.152 41.98 141.766 42.66C141.379 43.34 141.186 44.12 141.186 45C141.186 45.8667 141.379 46.64 141.766 47.32C142.152 48 142.686 48.5333 143.366 48.92C144.059 49.2933 144.846 49.48 145.726 49.48C146.659 49.48 147.499 49.28 148.246 48.88V44.78ZM156.575 42.66C156.949 42.14 157.449 41.7467 158.075 41.48C158.715 41.2133 159.449 41.08 160.275 41.08V43.96C159.929 43.9333 159.695 43.92 159.575 43.92C158.682 43.92 157.982 44.1733 157.475 44.68C156.969 45.1733 156.715 45.92 156.715 46.92V52H153.595V41.24H156.575V42.66ZM166.753 52.16C165.62 52.16 164.6 51.9267 163.693 51.46C162.8 50.98 162.1 50.32 161.593 49.48C161.086 48.64 160.833 47.6867 160.833 46.62C160.833 45.5533 161.086 44.6 161.593 43.76C162.1 42.92 162.8 42.2667 163.693 41.8C164.6 41.32 165.62 41.08 166.753 41.08C167.886 41.08 168.9 41.32 169.793 41.8C170.686 42.2667 171.386 42.92 171.893 43.76C172.4 44.6 172.653 45.5533 172.653 46.62C172.653 47.6867 172.4 48.64 171.893 49.48C171.386 50.32 170.686 50.98 169.793 51.46C168.9 51.9267 167.886 52.16 166.753 52.16ZM166.753 49.6C167.553 49.6 168.206 49.3333 168.713 48.8C169.233 48.2533 169.493 47.5267 169.493 46.62C169.493 45.7133 169.233 44.9933 168.713 44.46C168.206 43.9133 167.553 43.64 166.753 43.64C165.953 43.64 165.293 43.9133 164.773 44.46C164.253 44.9933 163.993 45.7133 163.993 46.62C163.993 47.5267 164.253 48.2533 164.773 48.8C165.293 49.3333 165.953 49.6 166.753 49.6ZM177.958 52.16C177.065 52.16 176.192 52.0533 175.338 51.84C174.485 51.6133 173.805 51.3333 173.298 51L174.338 48.76C174.818 49.0667 175.398 49.32 176.078 49.52C176.758 49.7067 177.425 49.8 178.078 49.8C179.398 49.8 180.058 49.4733 180.058 48.82C180.058 48.5133 179.878 48.2933 179.518 48.16C179.158 48.0267 178.605 47.9133 177.858 47.82C176.978 47.6867 176.252 47.5333 175.678 47.36C175.105 47.1867 174.605 46.88 174.178 46.44C173.765 46 173.558 45.3733 173.558 44.56C173.558 43.88 173.752 43.28 174.138 42.76C174.538 42.2267 175.112 41.8133 175.858 41.52C176.618 41.2267 177.512 41.08 178.538 41.08C179.298 41.08 180.052 41.1667 180.798 41.34C181.558 41.5 182.185 41.7267 182.678 42.02L181.638 44.24C180.692 43.7067 179.658 43.44 178.538 43.44C177.872 43.44 177.372 43.5333 177.038 43.72C176.705 43.9067 176.538 44.1467 176.538 44.44C176.538 44.7733 176.718 45.0067 177.078 45.14C177.438 45.2733 178.012 45.4 178.798 45.52C179.678 45.6667 180.398 45.8267 180.958 46C181.518 46.16 182.005 46.46 182.418 46.9C182.832 47.34 183.038 47.9533 183.038 48.74C183.038 49.4067 182.838 50 182.438 50.52C182.038 51.04 181.452 51.4467 180.678 51.74C179.918 52.02 179.012 52.16 177.958 52.16ZM184.563 41.24H187.683V52H184.563V41.24ZM186.123 39.74C185.55 39.74 185.083 39.5733 184.723 39.24C184.363 38.9067 184.183 38.4933 184.183 38C184.183 37.5067 184.363 37.0933 184.723 36.76C185.083 36.4267 185.55 36.26 186.123 36.26C186.697 36.26 187.163 36.42 187.523 36.74C187.883 37.06 188.063 37.46 188.063 37.94C188.063 38.46 187.883 38.8933 187.523 39.24C187.163 39.5733 186.697 39.74 186.123 39.74ZM193.159 42.66C193.532 42.14 194.032 41.7467 194.659 41.48C195.299 41.2133 196.032 41.08 196.859 41.08V43.96C196.512 43.9333 196.279 43.92 196.159 43.92C195.266 43.92 194.566 44.1733 194.059 44.68C193.552 45.1733 193.299 45.92 193.299 46.92V52H190.179V41.24H193.159V42.66Z"
              fill="#101828"
            />
            <path
              d="M47 26L0 26.7055L1.00645 69.8234L46.3641 66.5989L47 26Z"
              fill="#F2F4F7"
            />
            <path
              d="M48 25L1 25.7055L2.00645 68.8234L47.3641 65.5989L48 25Z"
              fill="#7F56D9"
            />
            <path
              d="M20.3495 47.9681L23.3072 47.8519L23.1199 53.5288C22.3415 54.1317 21.4477 54.606 20.4384 54.9517C19.429 55.2975 18.4181 55.4903 17.4055 55.53C15.9533 55.5871 14.6578 55.3319 13.5189 54.7644C12.3804 54.1837 11.4962 53.36 10.8661 52.2934C10.2497 51.213 9.96445 49.9798 10.0102 48.5939C10.0559 47.208 10.4232 45.9559 11.1121 44.8375C11.8148 43.7052 12.7624 42.8096 13.9551 42.1505C15.1482 41.4781 16.4775 41.1132 17.943 41.0556C19.1687 41.0074 20.2744 41.1703 21.26 41.5441C22.2456 41.918 23.0652 42.4846 23.7187 43.2442L21.577 45.2448C20.6125 44.2313 19.4241 43.7523 18.0119 43.8078C17.1192 43.8429 16.3204 44.0606 15.6152 44.4609C14.9101 44.8613 14.3532 45.4089 13.9444 46.1037C13.5356 46.7985 13.3167 47.5856 13.2877 48.4652C13.2591 49.3314 13.4267 50.0967 13.7907 50.7611C14.1546 51.4256 14.67 51.9377 15.3367 52.2974C16.0172 52.6434 16.7971 52.799 17.6764 52.7645C18.609 52.7278 19.455 52.495 20.2142 52.0659L20.3495 47.9681ZM35.3676 47.378L38.3253 47.2618L38.138 52.9387C37.3596 53.5416 36.4658 54.0159 35.4565 54.3617C34.4471 54.7074 33.4362 54.9002 32.4236 54.94C30.9714 54.997 29.6759 54.7418 28.537 54.1744C27.3985 53.5936 26.5143 52.7699 25.8842 51.7034C25.2678 50.6229 24.9825 49.3898 25.0283 48.0039C25.074 46.618 25.4413 45.3658 26.1302 44.2474C26.8329 43.1152 27.7805 42.2195 28.9732 41.5605C30.1663 40.8881 31.4956 40.5231 32.9611 40.4655C34.1868 40.4173 35.2925 40.5802 36.2781 40.954C37.2637 41.3279 38.0833 41.8946 38.7368 42.6541L36.5951 44.6547C35.6306 43.6412 34.4422 43.1622 33.03 43.2177C32.1373 43.2528 31.3385 43.4705 30.6333 43.8709C29.9282 44.2712 29.3713 44.8188 28.9625 45.5136C28.5537 46.2084 28.3348 46.9956 28.3058 47.8751C28.2772 48.7413 28.4448 49.5066 28.8088 50.1711C29.1727 50.8355 29.6881 51.3476 30.3548 51.7074C31.0353 52.0533 31.8152 52.209 32.6945 52.1744C33.6271 52.1378 34.4731 51.9049 35.2323 51.4758L35.3676 47.378Z"
              fill="#F2F4F7"
            />
          </svg>
  
          <div class="column" style="align-items: end">
            <span class="text-18">ORDER ID</span>
            <span class="text-14">${data?.orderId}</span>
          </div>
        </div>
        <div class="column-2" style="margin-top: 50px">
          <div class="left column">
            <span class="text-18">KEPADA : </span>
            <ul>
              <li><span class="text-14">${data?.user?.name}</span></li>
              <li><span class="text-14">${data?.user?.email} </span></li>
            </ul>
          </div>
          <div class="right">
            <span class="text-18">TANGGAL : </span>
            <ul>
              <li><span class="text-14">${moment(data?.createdAt).format(
                "DD MMMM YYYY"
              )} </span></li>
            </ul>
          </div>
        </div>
        <table style="margin-top: 30px" cellspacing="0">
          <tr>
            <th>Nama Barang</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Total</th>
          </tr>
          ${data?.details.map((item) => {
            return ` <tr>
                <td>${item?.product?.name}</td>
                <td>${formatRupiah(item?.price)}</td>
                <td>${item?.qty}</td>
                <td>${formatRupiah(item?.qty * item?.price)}</td>
              </tr>`;
          })}
        </table>
        <div class="column-2" style="margin-top: 20px">
          <div class="left column">
            <span class="text-18">Pembayaran : </span>
            <!--  
            <ul>
              <li><span class="text-14">Ian febi Sastrataruna </span></li>
              <li><span class="text-14">ianfebi01@gmail.com </span></li>
            </ul>
            -->
          </div>
          <div class="right t-right" style="justify-content: center">
            <table>
              <tr>
                <td>TOTAL</td>
                <td>${formatRupiah(
                  data?.details.reduce((a, c) => a + c.price * c.qty, 0)
                )}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="column-2" style="margin-top: auto">
          <div class="left column-left">
            <span class="text-18">Terimakasih </span>
            <ul>
              <li><span class="text-14">Gendut Grosir </span></li>
              <li>
                <span class="text-14"
                  >Semuluhkidu, Ngeposari, Semanu, Gunungkidul</span
                >
              </li>
            </ul>
          </div>
        </div>
        <!-- <ul>
          {{#each users}}
          <li>Name: {{this.name}}</li>
          <li>Age: {{this.age}}</li>
          <br />
          {{/each}}
        </ul> -->
      </div>
    </body>
  </html>  
    `;
  return html;
};
