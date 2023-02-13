//
//  GIMMICK - Graphical Interface of Multi-Modal Imaging and sCientific Kit
//  Copyright (C) 2023  Jean-Christophe Taveau
//
//  This file is part of GIMMICK
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with GIMMICK. If not, see <http://www.gnu.org/licenses/>.
//
// Authors: 
// 

'use strict';

export class GIMMICK {

  static get version() {
      return "0.1";
    } 
    
    static get authors() {
      return ["Jean-Christophe Taveau"];
    }

    static init() {
      console.log('INIT GIMMICK');
      this.websocket: undefined;
    }
  

}
  



  
