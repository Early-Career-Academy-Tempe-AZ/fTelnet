/*
  fTelnet: An HTML5 WebSocket client
  Copyright (C) 2009-2013  Rick Parrish, R&M Software

  This file is part of fTelnet.

  fTelnet is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or any later version.

  fTelnet is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with fTelnet.  If not, see <http://www.gnu.org/licenses/>.
*/
class CrtLabel extends CrtControl {
    private _Text: string;
    private _TextAlign: ContentAlignment;

    constructor(parent: CrtControl, left: number, top: number, width: number, text: string, textAlign: ContentAlignment, foreColour: number, backColour: number) {
        super(parent, left, top, width, 1);

        this._Text = text;
        this._TextAlign = textAlign;

        // Do these second because they force a paint and will cause an exception if they happen before the text is assigned
        this.ForeColour = foreColour;
        this.BackColour = backColour;

        this.Paint(true);
    }

    public Paint(force: boolean): void {
        // Draw the message
        var Lines: string[] = this._Text.replace("\r\n", "\n").split("\n");
        for (var i: number = 0; i < Lines.length; i++) {
            // Break if the line number is greater than the height
            if (i === this.Height) {
                break;
            }

            // Output the line with the correct alignment
            switch (this._TextAlign) {
                case ContentAlignment.Center:
                    if (Lines[i].length >= this.Width) {
                        // Text is greater than available space so chop it off with PadRight()
                        Crt.FastWrite(Lines[i].substring(0, this.Width), this.ScreenLeft, this.ScreenTop + i, new CharInfo(' ', this.ForeColour + (this.BackColour << 4)));
                    } else {
                        // Text needs to be centered
                        var i: number = 0;
                        var LeftSpaces: string = '';
                        for (i = 0; i < Math.floor((this.Width - Lines[i].length) / 2); i++) {
                            LeftSpaces += ' ';
                        }
                        var RightSpaces: string = '';
                        for (i = 0; i < this.Width - Lines[i].length - LeftSpaces.length; i++) {
                            RightSpaces += ' ';
                        }
                        Crt.FastWrite(LeftSpaces + Lines[i] + RightSpaces, this.ScreenLeft, this.ScreenTop + i, new CharInfo(' ', this.ForeColour + (this.BackColour << 4)));
                    }
                    break;
                case ContentAlignment.Left:
                    Crt.FastWrite(StringUtils.PadRight(Lines[i], ' ', this.Width), this.ScreenLeft, this.ScreenTop + i, new CharInfo(' ', this.ForeColour + (this.BackColour << 4)));
                    break;
                case ContentAlignment.Right:
                    Crt.FastWrite(StringUtils.PadLeft(Lines[i], ' ', this.Width), this.ScreenLeft, this.ScreenTop + i, new CharInfo(' ', this.ForeColour + (this.BackColour << 4)));
                    break;
            }
        }
    }

    public get Text(): string {
        return this._Text;
    }

    public set Text(value: string) {
        this._Text = value;
        this.Paint(true);
    }

    public get TextAlign(): ContentAlignment {
        return this._TextAlign;
    }

    public set TextAlign(value: ContentAlignment) {
        if (value !== this._TextAlign) {
            this._TextAlign = value;
            this.Paint(true);
        }
    }
}
