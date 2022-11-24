import React from 'react';
import CollapsibleWellComponent from '../CollapsibleWell';
import {getMachineByAgent, getMachineByIP, getMachineHostname, getMachineIPs} from '../../../utils/ServerUtils';


export function getAllTunnels(agents, machines) {
  let islandIPs = [];
  for (let machine of machines) {
    if (machine.island === true) {
      islandIPs = islandIPs.concat(
        ...getMachineIPs(machine)
      );
    }
  }

  let tunnels = [];
  for (let agent of agents) {
    if (!islandIPs.includes(agent.cc_server.ip)) {
      let agentMachine = getMachineByAgent(agent, machines);
      if (agentMachine !== null) {
        let agentMachineInfo = {
          'id': agentMachine.id,
          'ip': getMachineIPs(agentMachine)[0],
          'hostname': getMachineHostname(agentMachine)
        };

        let agentTunnelMachineInfo = {
          'id': -1,
          'ip': agent.cc_server.ip,
          'hostname': agent.cc_server.ip
        };

        let agentTunnelMachine = getMachineByIP(agent.cc_server.ip, machines)
        if (agentTunnelMachine !== null) {
          agentTunnelMachineInfo.id = agentTunnelMachine.id;
          agentTunnelMachineInfo.hostname = getMachineHostname(agentTunnelMachine);
        }

        tunnels.push({
          'agent_machine': agentMachineInfo,
          'agent_tunnel': agentTunnelMachineInfo
        });
      }
    }
  }
  return tunnels;
}

export function tunnelIssueOverview(allTunnels) {
  if (allTunnels.length > 0) {
    return ( <li key="tunnel">Weak segmentation -
      Machines were able to relay communications over unused ports.</li>)
  } else {
    return null;
  }
}

export function tunnelIssueReportByMachine(machineId, allTunnels) {
  if (allTunnels.length > 0) {
    let tunnelIssuesByMachine = getTunnelIssuesByMachine(machineId, allTunnels);

    if (tunnelIssuesByMachine.length > 0) {
      return (
        <>
          Use micro-segmentation policies to disable communication other than the required.
          <CollapsibleWellComponent>
            Machines are not locked down at port level.
            Network tunnels were set up between the following.
            <ul>
              {tunnelIssuesByMachine}
            </ul>
          </CollapsibleWellComponent>
        </>
      );
    }
  }

  return null;
}

function machineNameComponent(tunnelMachineInfo) {
  return <>
      <span className="badge badge-primary">{tunnelMachineInfo.hostname}</span> (
      <span className="badge badge-info" style={{ margin: '2px' }}>{tunnelMachineInfo.ip}</span>)</>
}

function getTunnelIssuesByMachine(machineId, allTunnels) {
  let tunnelIssues = [];

  for (let tunnel of allTunnels) {
    if (tunnel.agent_machine.id === machineId || tunnel.agent_tunnel.id === machineId) {
      let agentMachineNameComponent = machineNameComponent(tunnel.agent_machine);
      let agentTunnelNameComponent = machineNameComponent(tunnel.agent_tunnel);

      tunnelIssues.push(
        <li key={tunnel.agent_machine+tunnel.agent_tunnel}>
          from {agentMachineNameComponent} to {agentTunnelNameComponent}
        </li>
      );
    }
  }

  return tunnelIssues;
}
