import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    this.initiateTerminal();
  }
  initiateTerminal() {
    const term = new Terminal({cursorBlink:true, cursorStyle:'underline'});
    const socket = new WebSocket('ws://localhost:3030');
    const attachAddon = new AttachAddon(socket);
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    // Attach the socket to term
    term.loadAddon(attachAddon);
    fitAddon.fit();
    
    term.open(document.getElementById('terminal'));
    term.write('Hello User, No Connection from Socket $ ')
    term.write('\r\n$ ')

    term.focus();

    socket.onopen = () => {
      var command = "";
      term.onKey((key, ev) => {
        if (key.domEvent.keyCode === 13) {
          command="";
          term.write("\r\n");
        } else {
          command +=key.key;
        }

      })
    }

  }

}
