import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DetalleCompraDto } from '../dto/detalle-compra.dto';
import { Formatter } from '../formatter/formatter';

export const FacturaDoc = (
  detalleCompraDto: DetalleCompraDto,
): TDocumentDefinitions => {
  const productos = detalleCompraDto.detalles_.map((detalle) => {
    return {
      producto: detalle.producto.nombre_producto,
      cantidad: detalle.cantidad_productos,
      precio: detalle.precio_unitario,
      total: detalle.total,
    };
  });
  const nombre_cliente = detalleCompraDto.cliente_.nombre_cliente;
  const nombre_tienda = detalleCompraDto.tienda_.nombre_tienda;
  const fecha_compra = detalleCompraDto.fecha_compra.toLocaleDateString();
  const id_compra = detalleCompraDto.id_compra;

  const subtotal = detalleCompraDto.detalles_.reduce(
    (acc, detalle) => acc + detalle.total,
    0,
  );
  const total_productos = detalleCompraDto.detalles_.reduce(
    (acc, detalle) => acc + detalle.cantidad_productos,
    0,
  );
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return {
    pageSize: 'A4',
    tagged: true,
    pageOrientation: 'portrait',
    pageMargins: [20, 60, 20, 40],
    // Marca de agua
    // watermark: {
    //   text: 'DOCUMENTO NO FISCAL',
    //   color: 'gray',
    //   opacity: 0.2,
    //   bold: true,
    //   italics: true,
    //   fontSize: 60,
    //   angle: -45,
    // },
    background: function () {
      return {
        text: 'DOCUMENTO NO FISCAL',
        color: 'gray',
        opacity: 0.3,
        bold: true,
        italics: true,
        fontSize: 60,
        alignment: 'center',
        margin: [0, 0, 0, 0],
        // en el centro de la pagina
        absolutePosition: { x: 0, y: 400 },
      };
    },
    header: {
      text: 'Factura Tiendas Don Pepe',
      fontSize: 18,
      style: 'header',
      alignment: 'center',
    },
    footer: function (currentPage, pageCount) {
      return [
        [
          {
            text: 'Gracias por su compra',
            style: 'footer',
            alignment: 'left',
            margin: [20, 0, 0, 0],
            fontSize: 8,
          },
          {
            text: 'Tiendas Don Pepe',
            style: 'footer',
            alignment: 'left',
            margin: [20, 0, 0, 0],
            fontSize: 8,
          },
        ],
        {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: 'right',
          margin: [0, 0, 20, 0],
          fontSize: 8,
        },
        ,
      ];
    },
    content: [
      ,
      // Datos del cliente y tienda
      {
        columns: [
          [
            {
              text: `Cliente: ${nombre_cliente}`,
              alignment: 'left',
              margin: [0, 0, 0, 5],
            },
            {
              text: `Tienda: ${nombre_tienda}`,
              alignment: 'left',
              margin: [0, 0, 0, 10],
            },
          ],
          [
            {
              text: `Fecha de compra: ${fecha_compra}`,
              alignment: 'right',
              margin: [0, 0, 0, 5],
            },
            {
              text: `ID de compra: ${id_compra}`,
              alignment: 'right',
              margin: [0, 0, 0, 5],
            },
            {
              text: `Total de productos: ${total_productos}`,
              alignment: 'right',
              margin: [0, 0, 0, 10],
            },
          ],
        ],
        columnGap: 20,
        margin: [0, 20, 0, 20],
      },
      // Datos de los productos y totales
      {
        layout: 'lightHorizontalLines',
        table: {
          body: [
            [
              { text: 'Producto', style: 'tableHeader', alignment: 'left' },
              { text: 'Cantidad', style: 'tableHeader', alignment: 'center' },
              {
                text: 'Precio Unitario',
                style: 'tableHeader',
                alignment: 'center',
              },
              { text: 'Total', style: 'tableHeader', alignment: 'center' },
            ],
            ...productos.map((producto) => [
              { text: producto.producto, alignment: 'left' },
              { text: producto.cantidad, alignment: 'center' },
              {
                text: Formatter.formatCurrency(producto.precio),
                alignment: 'center',
              },
              {
                text: Formatter.formatCurrency(producto.total),
                alignment: 'center',
                margin: [0, 0, 10, 0],
              },
            ]),
          ],
          widths: ['*', 'auto', 'auto', 'auto'],
          headerRows: 1,
        },
      },
      // Linea negra debajo de la tabla
      {
        margin: [0, 20, 0, 0],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 555,
            y2: 0,
            lineWidth: 1,
            lineColor: 'black',
          },
        ],
      },
      // Totales
      [
        {
          text: `Subtotal: ${Formatter.formatCurrency(subtotal)}`,
          alignment: 'right',
          margin: [0, 10, 0, 0],
        },
        {
          text: `IVA (16%): ${Formatter.formatCurrency(iva)}`,
          alignment: 'right',
          margin: [0, 5, 0, 0],
        },
        {
          text: `Total: ${Formatter.formatCurrency(total)}`,
          style: 'total',
          alignment: 'right',
          margin: [0, 5, 0, 0],
        },
      ],
      {
        margin: [0, 5, 0, 0],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 555,
            y2: 0,
            lineWidth: 1,
            lineColor: 'black',
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        margin: [0, 15, 0, 0],
        bold: true,
      },
      subheader: {
        fontSize: 14,
        bold: true,
      },
      tableHeader: {
        fillColor: '#f0f0f0',
        fontSize: 12,
        bold: true,
        color: 'black',
      },
      total: {
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 0],
      },
      footer: {
        fontSize: 10,
        margin: [0, 20, 0, 0],
        alignment: 'center',
        color: 'gray',
      },
    },
  };
};

