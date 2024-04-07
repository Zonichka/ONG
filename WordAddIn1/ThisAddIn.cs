using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Word = Microsoft.Office.Interop.Word;
using Office = Microsoft.Office.Core;
using Microsoft.Office.Tools.Word;
using System.Windows.Forms;

namespace WordAddIn1
{
    public partial class ThisAddIn
    {

        private Office.CommandBarPopup contextMenuPopup;

        private void ThisAddIn_Startup(object sender, System.EventArgs e)
        {
            // Получаем объект CommandBar контекстного меню
            Office.CommandBar contextMenu = ((Office.CommandBars)this.Application.CommandBars)["Text"];

            // Создаем новый пункт подменю в контекстном меню
            contextMenuPopup = (Office.CommandBarPopup)contextMenu.Controls.Add(
                Office.MsoControlType.msoControlPopup, Type.Missing, Type.Missing, Type.Missing, true);

            // Настройка свойств пункта подменю
            contextMenuPopup.Caption = "Моя надстройка";

            // Создаем элементы подменю
            Office.CommandBarButton menuItem1 = (Office.CommandBarButton)contextMenuPopup.Controls.Add(
                Office.MsoControlType.msoControlButton, Type.Missing, Type.Missing, Type.Missing, true);
            menuItem1.Caption = "Дополнить текст";
            menuItem1.Click += new Office._CommandBarButtonEvents_ClickEventHandler(menuItem1_Click);

            Office.CommandBarButton menuItem2 = (Office.CommandBarButton)contextMenuPopup.Controls.Add(
                Office.MsoControlType.msoControlButton, Type.Missing, Type.Missing, Type.Missing, true);
            menuItem2.Caption = "Тест2";
            menuItem2.Click += new Office._CommandBarButtonEvents_ClickEventHandler(menuItem2_Click);
        }

        private void menuItem1_Click(Office.CommandBarButton Ctrl, ref bool CancelDefault)
        {
            // Получаем объект Range текущего выделения в документе Word
            Word.Range range = this.Application.Selection.Range;

            // Добавляем к текущему местоположению текст
            string additionalText = "Вставка";
            range.InsertAfter(" " + additionalText);
        }

        private void menuItem2_Click(Office.CommandBarButton Ctrl, ref bool CancelDefault)
        {
            // Действия, выполняемые при клике на элемент подменю "Тест2"
            MessageBox.Show("Выбрано: Тест2");
        }


        private void ThisAddIn_Shutdown(object sender, System.EventArgs e)
        {
        }

        #region Код, автоматически созданный VSTO

        /// <summary>
        /// Требуемый метод для поддержки конструктора — не изменяйте 
        /// содержимое этого метода с помощью редактора кода.
        /// </summary>
        private void InternalStartup()
        {
            this.Startup += new System.EventHandler(ThisAddIn_Startup);
            this.Shutdown += new System.EventHandler(ThisAddIn_Shutdown);
        }
        
        #endregion
    }
}
