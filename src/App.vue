<template>
  <div id="app">
    <v-app>
      <v-container fill-height>
        <v-col class="my-4" align="center" justify="center" fill-height>
          <v-file-input color="primary" outlined v-model="file" accept=".xlsx" label="Subir excel" @change="uploadFile"></v-file-input>
          <v-expand-transition>
              <v-card v-show="isValidFile && !loading && jsonEquipos.length > 0">
                <v-data-table
                  :loading="loading"
                  :headers="[
                    {
                      text: 'Codigo',
                      value: 'CODIGO'
                    },
                    {
                      text: 'Equipo',
                      value: 'EQUIPO'
                    },
                    {
                      text: 'Inventario',
                      value: 'Inventario'
                    },
                    {
                      text: 'Marca',
                      value: 'MARCA'
                    },
                    {
                      text: 'Modelo',
                      value: 'Modelo'
                    },
                    {
                      text: 'SCR',
                      value: 'SCR'
                    },
                    {
                      text: 'Serie',
                      value: 'Serie'
                    },
                    {
                      text: 'Ubicación',
                      value: 'UBICACIÓN'
                    },
                    {
                      text: 'Ver informe',
                      value: 'report'
                    }
                  ]"
                  :items="jsonEquipos"
                  :items-per-page="10">
                  <template v-slot:item.report="{ item }">
                    <v-btn color="primary" fab depressed x-small @click="displayReport(item)">
                      <v-icon small>
                        mdi-eye
                      </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <v-btn class="my-4" color="primary" rounded @click="displayAllReports">
                  <v-icon left>
                    mdi-download
                  </v-icon>descargar informe completo
                </v-btn>
              </v-card>
          </v-expand-transition>
        </v-col>
      </v-container>
    </v-app>
  </div>
</template>
<script>
import XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import assetsBase64 from './assets/base64';

export default {
  data: function () {
    return {
      file: null,
      jsonEquipos: [],
      selectedEquip: {},
      loading: false
    }
  },
  computed: {
    isValidFile () {
      return Object.prototype.toString.call(this.file) === '[object File]'
    }
  },
  methods: {
    uploadFile() {
      if (this.isValidFile) {
        this.loading = true
        const fileReader = new FileReader()
        fileReader.onload = () => {
          const data = new Uint8Array(fileReader.result)
          var arr = new Array()
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i])
          var bstr = arr.join("")
  
          var workbook = XLSX.read(bstr, {type:"binary"})
  
          var first_sheet_name = workbook.SheetNames[0]
          var worksheet = workbook.Sheets[first_sheet_name]
          this.jsonEquipos = XLSX.utils.sheet_to_json(worksheet,{raw:true})
          this.loading = false
        }
        fileReader.readAsArrayBuffer(this.file)
      }
    },
    addReport (doc, equipo) {
      this.selectedEquip = equipo

      doc.addImage(assetsBase64.lifetecLogo,
      'PNG', 15, 10, 80, 35)
      doc.setFontStyle("italic")
      doc.setFontSize(8)
      doc.text('LIFETEC', 140, 15)
      doc.text('Rut: 76.751.182-5', 140, 19)
      doc.text('Importación, Comercialización, Servicio', 140, 23)
      doc.text('Técnico de Equipos Médicos', 140, 27)
      doc.setTextColor('#0645AD')
      doc.text('www.lifetec.cl', 140, 31)
      doc.text('contacto@lifetec.cl', 140, 35)
      doc.setTextColor('#000000')
      doc.text('+56982920077', 140, 39)
      doc.text('+56993157411', 140, 43)

      doc.setFont("times");
      doc.setFontStyle("bold");
      doc.text('ESTABLECIMIENTO: HOSPITAL DE ARICA DR. JUAN NOÉ CREVANI', 15, 70)
      doc.text('INFORME TECNICO PRUEBAS DE SEGURIDAD ELECTRICA', 15, 80)
      
      doc.setFontSize(7)
      doc.autoTable({
        theme: 'grid',
        styles: { fontSize: 8},
        head: [[{ content: 'ANTECEDENTES DEL EQUIPO', colSpan: 2, styles: { halign: 'center', fillColor: '#222222', minCellWidth: 50 } }]],
        body: [
          [
            'Fecha:          25-10-2019',
            'Equipo:          '+equipo.EQUIPO
          ],
          [
            'Marca:          '+equipo.MARCA,
            'Modelo:          '+equipo.Modelo
          ],
          [
            'Serie:           '+equipo.Serie,
            'Código:          '+equipo.CODIGO
          ],
          [
            { 
              content: 'Ubicacion:    '+equipo['UBICACIÓN'],
              colSpan: 2
            }
          ]
        ],
        margin: {top: 90},
      });
      doc.autoTable({
        theme: 'grid',
        styles: { fontSize: 8},
        head: [[{ content: 'PRUEBAS DE SEGURIDAD ELÉCTRICA', colSpan: 4, styles: { halign: 'center', fillColor: '#222222' } }]],
        body: [
          [
            'Analizador de seguridad eléctrica Netech LKG 610',
            'IEC - 60601',
            'PASA',
            'FALLA'
          ],
          [
            'Tensión de Red',
            '220 ± 10 [V]',
            '',
            ''
          ],
          [
            'Corriente de Fuga a Tierra',
            '< 500 uA',
            '',
            ''
          ],
          [
            'Corriente de Fuga a Chasis',
            '< 100 uA',
            '',
            ''
          ],
          [
            'Corriente de Fuga a los Electrodos del Paciente',
            '< 10 uA',
            '',
            ''
          ],
          [
            'Corriente Auxiliar de los Electrodos del Paciente a las partes aplicadas',
            ' < 10 uA',
            '',
            ''
          ],
          [
            'Resistencia a Tierra',
            '',
            '',
            ''
          ],
          [
            {
              content:'Observaciones',
              colSpan: 4,
              styles: { minCellHeight: 20 }
            }
          ]
        ],
        margin: {top: 90},
        didDrawCell: data => {
          if (data.section === 'body' && data.column.index === 2 && data.row.index !== 0 && data.row.index !== 7) {
            console.log('T'+ data.row.index, equipo['T'+data.row.index])
            if (equipo['T'+data.row.index] === 'SI') {
              doc.addImage(assetsBase64.checkMark, 'JPEG', data.cell.x + 4.6, data.cell.y + 2, 6, 4)
            }
          }
          if (data.section === 'body' && data.column.index === 3 && data.row.index !== 0 && data.row.index !== 7) {
            console.log('T'+ data.row.index, equipo['T'+data.row.index])
            if (equipo['T'+data.row.index] !== 'SI') {
              doc.addImage(assetsBase64.checkMark, 'JPEG', data.cell.x + 4.6, data.cell.y + 2, 6, 4)
            }
          }
          if (data.section === 'body' && data.column.index === 1 && data.row.index === 6) {
            doc.text('< 0.2 [', data.cell.x + 2.5, data.cell.y + 4.6, 4, 5)
            doc.addImage(assetsBase64.omegaSymbol, 'JPEG', data.cell.x + 11, data.cell.y + 2, 2, 2.5)
            doc.text(']', data.cell.x + 14, data.cell.y + 4, 4, 5)
          }
        }
      })
      doc.setFontSize(9)
      doc.setFontStyle("normal")

      doc.text('NOTA: Para asegurar el correcto funcionamiento de los equipos médicos críticos y eliminar posibilidades de fugas de corriente indeseadas y peligrosas, Se recomienda por norma No reemplazar enchufes, se debe cambiar cable de poder completo nuevo con conexión blindada.', 15, 220, { maxWidth: 180 })
      
      doc.setFontSize(10)
      doc.setFontStyle("bold")
      
      doc.addImage(assetsBase64.lifetecSign, 'JPEG', 15, 235 + 2, 45, 30)
      doc.text('LIFETEC', 30, 260, { maxWidth: 180 })
     
      doc.setFontSize(9)
      doc.setFontStyle("italic")

      doc.text('contacto@lifetec.cl', 15, 290)
      doc.text('fono: +56993157411', 95, 290)
      doc.text('Manuel Bayón 3273  THNO', 160, 290)

      return doc
    },
    displayAllReports () {
      let report = new jsPDF()
      this.jsonEquipos.forEach((equipment, index) => {
        if (index < 350) {
          this.addReport(report, equipment)
          report.addPage()
        }
      })
      report.save('informe-completo.pdf')
    },
    displayReport (equipment) {
      var report = new jsPDF()
      this.addReport(report, equipment)
      report.output('dataurlnewwindow', equipment.Inventario + '.pdf')
    },
    converXLSToJSON() {
      /*
      const json = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
      */
    }
  },
}
</script>
<style lang="scss">
</style>
