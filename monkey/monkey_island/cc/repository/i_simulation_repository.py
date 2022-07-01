from abc import ABC

from monkey_island.cc.models import Simulation
from monkey_island.cc.services.mode.mode_enum import IslandModeEnum


class ISimulationRepository(ABC):
    def save_simulation(self, simulation: Simulation):
        pass

    def get_simulation(self):
        pass

    def get_mode(self) -> IslandModeEnum:
        """
        Get's the island's current mode

        :return The island's current mode
        :raises RetrievalError: If the mode could not be retrieved
        """
        pass

    def set_mode(self, mode: IslandModeEnum):
        """
        Set the island's mode

        :param mode: The island's new mode
        :raises StorageError: If the mode could not be saved
        """

        pass
